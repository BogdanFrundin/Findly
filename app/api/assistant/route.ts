import { NextResponse } from "next/server";
import { searchProducts, fmt, plural } from "@/lib/search";

/**
 * Assistant endpoint.
 * With ANTHROPIC_API_KEY set, Claude rewrites the shopper's message into a short catalogue query.
 * Without it, the built-in parser handles the message directly, so the site works with no keys.
 */
async function toQuery(message: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return message;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
        max_tokens: 60,
        system: "Перетвори запит покупця на короткий пошуковий рядок українською: річ, колір, крій, бюджет «до N». Лише рядок, без пояснень. Приклад: «сукня міді бордова до 3000».",
        messages: [{ role: "user", content: message }],
      }),
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) return message;
    const j = await r.json();
    const text = j?.content?.[0]?.text?.trim();
    return text || message;
  } catch {
    return message;
  }
}

export async function POST(req: Request) {
  const { message, cheaper, last } = (await req.json().catch(() => ({}))) as { message?: string; cheaper?: boolean; last?: string };
  if (!message || typeof message !== "string") return NextResponse.json({ error: "Порожнє повідомлення" }, { status: 400 });

  if (/образ/i.test(message) && !cheaper) {
    return NextResponse.json({ text: "Для образу краще підійде розділ «Образи»: там я поставлю кілька запитань і зберу комплект повністю.", goLooks: true });
  }
  let q = cheaper && last ? last : await toQuery(/весілл|свадьб/i.test(message) ? "сукня міді преміум до 3000" : message);
  const res = searchProducts(q, [], cheaper ? "price" : "match");
  if (!res.list.length || (!res.parsed.cat && !res.parsed.color)) {
    return NextResponse.json({ text: "Поки не знайшла точного варіанта. Уточніть, будь ласка: яка річ, колір і бюджет?", chips: ["Чорна сукня до 2 500 ₴", "Бежевий тренч", "Білі кросівки"], query: q });
  }
  const items = res.list.slice(0, 4).map((x) => x.p.id);
  const first = res.list[0].p, n = res.list.length;
  const text = `${cheaper ? "Ось дешевші варіанти" : `Знайшла ${n} ${plural(n, "варіант", "варіанти", "варіантів")}`}${res.parsed.budget ? " у межах " + fmt(res.parsed.budget) : ""}. ${cheaper ? "Найдоступніший" : "Найбільш відповідний"} — ${first.name} у ${first.store} за ${fmt(first.price)}.`;
  return NextResponse.json({ text, items, chips: ["Дешевше", "Інший колір", "Зібрати образ із цим"], query: q });
}
