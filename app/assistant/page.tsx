"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Chrome";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/components/AppState";
import { byId } from "@/lib/catalog";

type Msg = { me?: boolean; typing?: boolean; text?: string; items?: string[]; chips?: string[] };
const START: Msg = { text: "Вітаю! Я асистентка FINDLY. Опишіть, що шукаєте: річ, привід, колір, бюджет. Я знайду варіанти в магазинах України.", chips: ["Сукня на весілля подруги", "Тепле пальто до 5 000 ₴", "Білі кросівки на щодень"] };

export default function Assistant() {
  const { s, ready, need } = useApp();
  const router = useRouter();
  const [msgs, setMsgs] = useState<Msg[]>([START]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const last = useRef<string>("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs]);
  useEffect(() => { if (ready && !(s.logged && s.pro)) need("pro", () => {}); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  async function ask(t: string) {
    t = t.trim(); if (!t || busy) return;
    if (/^зібрати образ/i.test(t)) { router.push("/looks"); return; }
    const cheaper = /^дешевш/i.test(t);
    setMsgs((m) => [...m, { me: true, text: t }, { typing: true }]); setBusy(true); setText("");
    try {
      const r = await fetch("/api/assistant", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: t, cheaper, last: last.current }) });
      const j = await r.json();
      if (j.query) last.current = j.query;
      setMsgs((m) => [...m.slice(0, -1), { text: j.text || "Щось пішло не так. Спробуйте ще раз.", items: j.items, chips: j.chips }]);
      if (j.goLooks) setTimeout(() => router.push("/looks?q=" + encodeURIComponent(t)), 1400);
    } catch {
      setMsgs((m) => [...m.slice(0, -1), { text: "Немає зв’язку. Перевірте інтернет і спробуйте ще раз." }]);
    } finally { setBusy(false); }
  }

  return (
    <>
      <Header />
      <main className="wrap narrow" style={{ marginInline: "auto" }}>
        <div className="stack g8" style={{ paddingTop: 20 }}>
          <span className="eyebrow bur"><span className="ms">auto_awesome</span> AI-асистентка · PRO</span>
          <h1 className="h2">Запитайте, <i>що вдягнути</i></h1>
        </div>
        <div className="chat">
          {msgs.map((m, i) => m.typing ? (
            <div key={i} className="msg ai"><div className="who"><i>F</i>Асистентка</div><span className="typing"><i /><i /><i /></span></div>
          ) : m.me ? (
            <div key={i} className="msg me">{m.text}</div>
          ) : (
            <div key={i} className={"msg ai" + (m.items ? " wide" : "")}>
              <div className={m.items ? "panel line" : ""}><div className="who"><i>F</i>Асистентка</div><div>{m.text}</div></div>
              {m.items ? <div className="hscroll mt12">{m.items.map((id) => byId[id] ? <ProductCard key={id} p={byId[id]} /> : null)}</div> : null}
              {m.chips ? <div className="chips mt12">{m.chips.map((c) => <button key={c} type="button" className="chip" onClick={() => ask(c)}>{c}</button>)}</div> : null}
            </div>
          ))}
          <div ref={end} />
        </div>
      </main>
      <div className="composer">
        <form onSubmit={(e) => { e.preventDefault(); need("pro", () => ask(text)); }}>
          <input id="ask" value={text} onChange={(e) => setText(e.target.value)} placeholder="Наприклад: сукня на побачення до 3 000 ₴" aria-label="Повідомлення асистентці" enterKeyHint="send" />
          <button className="send" type="submit" aria-label="Надіслати" disabled={busy}><span className="ms">arrow_upward</span></button>
        </form>
      </div>
    </>
  );
}
