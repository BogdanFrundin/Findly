"use client";
import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { ProductImage } from "@/components/Art";
import { useApp } from "@/components/AppState";
import { byId } from "@/lib/catalog";
import { fmt } from "@/lib/search";

export default function Alerts() {
  const app = useApp();
  const { s } = app;
  const items = Object.entries(s.tracked).map(([id, t]) => ({ p: byId[id], t })).filter((x) => x.p);
  const demo = byId.j1;
  const setT = (id: string, d: number) => app.set((st) => ({ tracked: { ...st.tracked, [id]: Math.max(100, st.tracked[id] + d) } }));
  const remove = (id: string) => app.set((st) => { const t = { ...st.tracked }; delete t[id]; return { tracked: t }; });
  return (
    <>
      <Header />
      <main className="wrap page">
        <div className="two">
          <div className="stack g16">
            <span className="eyebrow bur">Ціни · PRO</span>
            <h1 className="h1">Стежу за ціною</h1>
            <p className="lead">Коли ціна знизиться до вашої цілі, ми напишемо в Telegram.</p>
            <div className="setrow" style={{ boxShadow: `inset 0 0 0 1px ${s.tg ? "var(--line)" : "var(--champ)"}` }}>
              <div>Telegram-бот FINDLY<small>{s.tg ? "Підключено · сповіщення увімкнені" : "Не підключено: сповіщення не прийдуть"}</small></div>
              <button className={"btn sm" + (s.tg ? " line" : "")} type="button" onClick={() => s.tg ? app.set({ tg: false }) : app.openModal("tg")}>{s.tg ? "Вимкнути" : "Підключити"}</button>
            </div>
            <div className="stack g16 mt8">
              {items.length ? items.map(({ p, t }) => {
                const hit = p.price <= t;
                return (
                  <div key={p.id} className={"alert" + (hit ? " hit" : "")}>
                    <div className="top"><span>{hit ? "Ціль досягнута" : "Чекаємо зниження"}</span><button type="button" aria-label="Перестати стежити" onClick={() => remove(p.id)}><span className="ms">close</span></button></div>
                    <div className="body">
                      <Link href={`/product/${p.id}`} className="tile"><ProductImage p={p} /></Link>
                      <div className="stack g8" style={{ flex: 1, minWidth: 0 }}>
                        <span className="store">{p.store}</span><span className="pname">{p.name}</span>
                        <div className="row" style={{ alignItems: "baseline", gap: 8 }}><span className="price" style={{ fontSize: 19 }}>{fmt(p.price)}</span>{p.old ? <span className="old">{fmt(p.old)}</span> : null}</div>
                        <div className="between small"><span className="muted">Ціль</span>
                          <span className="stepper"><button type="button" aria-label="Менше" onClick={() => setT(p.id, -100)}><span className="ms">remove</span></button><span>{fmt(t)}</span><button type="button" aria-label="Більше" onClick={() => setT(p.id, 100)}><span className="ms">add</span></button></span></div>
                      </div>
                    </div>
                  </div>
                );
              }) : <div className="empty"><span className="ms">notifications</span><span>Натисніть «Стежити за ціною» в картці будь-якої речі.</span><Link className="btn sm" href="/search">До пошуку</Link></div>}
            </div>
          </div>
          <div>
            <div className="panel line stack g12">
              <span className="eyebrow">Так прийде повідомлення в Telegram</span>
              <div className="row" style={{ alignItems: "flex-start" }}>
                <span className="tgava">F</span>
                <div className="stack g4" style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 15 }}>FINDLY</b>
                  <div className="tgmsg"><b>Ціна знизилася</b><br />{demo.name} — тепер {fmt(demo.price)} замість {fmt(demo.old || demo.price)} у {demo.store}.</div>
                  <div className="tgbtns"><span>У магазин</span><span>Відкрити FINDLY</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
