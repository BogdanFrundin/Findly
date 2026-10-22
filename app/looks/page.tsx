"use client";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Chrome";
import { ProductImage } from "@/components/Art";
import { useApp } from "@/components/AppState";
import { byId } from "@/lib/catalog";
import { ALTS, QUIZ, buildLook, lookFromText, lookTitle, type Answers } from "@/lib/looks";
import { fmt, plural } from "@/lib/search";

function Looks() {
  const app = useApp();
  const initial = useSearchParams().get("q");
  const [a, setA] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [look, setLook] = useState<{ ids: string[]; budget: number } | null>(null);
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { if (initial) { const ans = lookFromText(initial); setA(ans); setStep(QUIZ.length); setLook(buildLook(ans)); } }, [initial]);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [step, look]);

  const answer = (k: string, v: string) => {
    const next = { ...a, [k]: v }; setA(next);
    const st = step + 1; setStep(st);
    if (st >= QUIZ.length) setLook(buildLook(next));
  };
  const reset = () => { setA({}); setStep(0); setLook(null); };
  const items = look ? look.ids.map((i) => byId[i]) : [];
  const total = items.reduce((s, p) => s + p.price, 0);
  const ok = look ? total <= look.budget : true;
  const swap = (i: number) => {
    if (!look) return;
    const cur = look.ids[i], alt = ALTS[cur];
    if (!alt || look.ids.includes(alt)) { app.toast("Іншої схожої речі поки немає", "info"); return; }
    const ids = look.ids.slice(); ids[i] = alt; setLook({ ...look, ids });
    app.toast("Замінили на «" + byId[alt].name + "»", "sync_alt");
  };
  const allToCart = () => {
    const add = items.filter((p) => !app.inCart(p.id));
    app.set((st) => ({ cart: [...st.cart, ...add.map((p) => ({ id: p.id, size: app.defSize(p) }))] }));
    app.toast("Образ у кошику", "shopping_bag");
  };

  return (
    <>
      <main className="wrap narrow" style={{ marginInline: "auto" }}>
        <div className="stack g8" style={{ paddingTop: 20 }}>
          <span className="eyebrow bur"><span className="ms">checkroom</span> Образи</span>
          <h1 className="h2">Зберемо образ <i>разом</i></h1>
        </div>
        <div className="chat">
          <div className="msg ai"><div className="who"><i>F</i>Стилістка</div>Зберу готовий образ за п’ять запитань. Або просто напишіть, що потрібно: «на побачення, тепле, у бордових тонах, до 5 000 ₴».</div>
          {QUIZ.map((q, i) => i > step ? null : (
            <div key={q.k} className="stack g12">
              <div className="msg ai"><div className="who"><i>F</i>Стилістка · {i + 1} з {QUIZ.length}</div>{q.q}
                {i === step && !look ? <div className="chips mt12">{q.o.map(([k, l]) => <button key={k} type="button" className="chip" onClick={() => answer(q.k, k)}>{l}</button>)}</div> : null}
              </div>
              {a[q.k] ? <div className="msg me">{(q.o.find((o) => o[0] === a[q.k]) || [])[1] || (q.k === "budget" ? "до " + fmt(Number(a.budget)) : a[q.k])}</div> : null}
            </div>
          ))}
          {look ? (
            <div className="msg ai wide">
              <div className="panel line"><div className="who"><i>F</i>Стилістка</div>
                {lookTitle(a)}. Разом {fmt(total)}{ok ? ", у межах бюджету." : `, це на ${fmt(total - look.budget)} понад бюджет. Натисніть ⇄ біля речі, щоб замінити її на доступнішу.`}</div>
              <div className="board mt12" style={{ maxWidth: 520 }}>
                {items.map((p) => <div key={p.id} className="tile"><ProductImage p={p} scale={0.86} /></div>)}
                {items.length % 2 ? <div className="tile" style={{ background: "var(--sand)", display: "grid", placeItems: "center" }}><span className="eyebrow">{items.length} {plural(items.length, "річ", "речі", "речей")}</span></div> : null}
              </div>
              <div className="stack g4 mt12">
                {items.map((p, i) => (
                  <div key={p.id} className="item">
                    <Link href={`/product/${p.id}`} className="stack g4" style={{ minWidth: 0 }}><span className="store">{p.store}</span><span>{p.name}</span><span className="price small">{fmt(p.price)}</span></Link>
                    <div className="row" style={{ gap: 6, flex: "none" }}>
                      <button type="button" className="iconbtn" aria-label="Замінити" onClick={() => swap(i)} style={{ boxShadow: "inset 0 0 0 1px var(--line)", width: 40, height: 40 }}><span className="ms">sync_alt</span></button>
                      <button type="button" className={"btn sm" + (app.inCart(p.id) ? " esp" : "")} onClick={() => app.toggleCart(p.id)}>{app.inCart(p.id) ? "✓" : "У кошик"}</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="stack g8 mt12">
                <button type="button" className="btn block" onClick={allToCart}>Весь образ у кошик · {fmt(total)}</button>
                <button type="button" className="btn line block" onClick={reset}>Зібрати інший</button>
              </div>
            </div>
          ) : null}
          <div ref={end} />
        </div>
      </main>
      <div className="composer">
        <form onSubmit={(e) => { e.preventDefault(); const v = text.trim(); if (!v) return; const ans = lookFromText(v); setA(ans); setStep(QUIZ.length); setLook(buildLook(ans)); setText(""); }}>
          <input id="lookq" value={text} onChange={(e) => setText(e.target.value)} placeholder="Опишіть своїми словами…" aria-label="Опишіть образ" enterKeyHint="send" />
          <button className="send" type="submit" aria-label="Надіслати"><span className="ms">arrow_upward</span></button>
        </form>
      </div>
    </>
  );
}

export default function LooksPage() {
  return (<><Header /><Suspense fallback={null}><Looks /></Suspense></>);
}
