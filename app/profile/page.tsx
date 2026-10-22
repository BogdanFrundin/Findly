"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Footer, Header } from "@/components/Chrome";
import { useApp } from "@/components/AppState";
import { STORES } from "@/lib/catalog";
import { fmt, plural } from "@/lib/search";

const STYLES = ["Мінімалізм", "Класика", "Романтика", "Монохром", "Спорт-шик", "Оверсайз"];

export default function Profile() {
  const app = useApp();
  const { s, ready } = app;
  const router = useRouter();
  useEffect(() => { if (ready && !s.logged) app.openModal("login"); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = (k: "styles" | "favStores", v: string) => app.set((st) => ({ [k]: st[k].includes(v) ? st[k].filter((x) => x !== v) : [...st[k], v] }));
  const nTr = Object.keys(s.tracked).length;

  return (
    <>
      <Header />
      <main className="wrap page">
        <div className="two">
          <div className="stack g16">
            <div className="feature" style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <span className="avatar" style={{ width: 64, height: 64, fontSize: 28 }}>А</span>
              <div className="stack g4"><span className="h3">Анастасія</span>
                <span className="small muted">{s.city || "Місто не обрано"} · <button className="link" type="button" style={{ fontSize: 10 }} onClick={() => app.openModal("city")}>змінити</button></span>
                <span className="pro-tag">{s.pro ? "FINDLY PRO · пробний період" : "Безкоштовний тариф"}</span></div>
            </div>
            <div>
              <div className="eyebrow ink" style={{ margin: "16px 0 10px" }}>Мої розміри</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                {([["top", "Верх", ["XS", "S", "M", "L", "XL"]], ["bottom", "Низ", ["25", "26", "27", "28", "29"]], ["shoes", "Взуття", ["36", "37", "38", "39", "40"]]] as const).map(([k, l, o]) => (
                  <label key={k} className="panel stack g8"><span className="eyebrow">{l}</span>
                    <select id={"size-" + k} value={s.sizes[k]} onChange={(e) => { app.set((st) => ({ sizes: { ...st.sizes, [k]: e.target.value } })); app.toast("Розмір збережено"); }}
                      style={{ border: 0, background: "transparent", font: "500 26px/1 var(--serif)" }}>{o.map((v) => <option key={v}>{v}</option>)}</select></label>
                ))}
              </div>
            </div>
            <div><div className="eyebrow ink" style={{ margin: "16px 0 10px" }}>Мій стиль</div>
              <div className="chips">{STYLES.map((v) => <button key={v} type="button" className={"chip" + (s.styles.includes(v) ? " on" : "")} onClick={() => toggle("styles", v)}>{v}</button>)}</div></div>
            <div><div className="eyebrow ink" style={{ margin: "16px 0 10px" }}>Улюблені магазини</div>
              <div className="chips">{Object.keys(STORES).map((v) => <button key={v} type="button" className={"chip" + (s.favStores.includes(v) ? " on" : "")} onClick={() => toggle("favStores", v)}>{v}</button>)}</div></div>
          </div>
          <div className="stack g4">
            <div className="eyebrow ink" style={{ marginBottom: 10 }}>Налаштування</div>
            <div className="setrow"><div>Бюджет за замовчуванням<small>Підставимо в образи</small></div>
              <span className="stepper"><button type="button" aria-label="Менше" onClick={() => app.set((st) => ({ budget: Math.max(1000, st.budget - 500) }))}><span className="ms">remove</span></button><span>{fmt(s.budget)}</span><button type="button" aria-label="Більше" onClick={() => app.set((st) => ({ budget: st.budget + 500 }))}><span className="ms">add</span></button></span></div>
            <div className="setrow"><div>Telegram<small>{s.tg ? "Підключено до бота FINDLY" : "Сповіщення про ціну приходять сюди"}</small></div>
              <button className={"btn sm" + (s.tg ? " line" : "")} type="button" onClick={() => s.tg ? (app.set({ tg: false }), app.toast("Telegram вимкнено", "send")) : app.openModal("tg")}>{s.tg ? "Вимкнути" : "Підключити"}</button></div>
            <Link className="setrow" href="/alerts"><div>Стежу за ціною<small>{nTr} {plural(nTr, "річ", "речі", "речей")}</small></div><span className="ms">chevron_right</span></Link>
            <Link className="setrow" href="/pro"><div>FINDLY PRO<small>{s.pro ? "Активний, 7 днів безкоштовно" : "Фото, асистентка, партнер, ціни"}</small></div><span className="ms">chevron_right</span></Link>
            <button className="link mt32" type="button" style={{ alignSelf: "center", color: "var(--muted)" }} onClick={() => { app.set({ logged: false, pro: false }); app.toast("Ви вийшли з акаунта"); router.push("/"); }}>Вийти з акаунта</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
