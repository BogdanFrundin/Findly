"use client";
import Link from "next/link";
import { useState } from "react";
import { Footer, Header } from "@/components/Chrome";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/components/AppState";
import { byId } from "@/lib/catalog";
import { fmt, plural } from "@/lib/search";

export default function Wishlist() {
  const app = useApp();
  const { s, ready } = app;
  const [tab, setTab] = useState<"mine" | "partner">("mine");
  const [pname, setPname] = useState("");

  if (ready && !s.logged) return (
    <><Header /><main className="wrap narrow page" style={{ marginInline: "auto" }}>
      <h1 className="h1">Вішліст</h1>
      <div className="empty mt24"><span className="ms">favorite</span><span className="h3">Зберігайте речі з різних магазинів</span>
        <span>Увійдіть, щоб зібрати вішліст і ділитися ним із близькими.</span>
        <button className="btn sm" type="button" onClick={() => app.openModal("login")}>Увійти</button></div>
    </main><Footer /></>
  );

  const mine = s.wish.map((i) => byId[i]).filter(Boolean);
  const invite = () => {
    const v = pname.trim(); if (!v) return;
    app.need("pro", () => {
      app.set({ partner: { name: v, ok: false } }); setPname(""); app.toast("Запрошення надіслано", "send");
      setTimeout(() => app.set((st) => (st.partner ? { partner: { ...st.partner, ok: true } } : {})), 1800);
    });
  };

  return (
    <>
      <Header />
      <main className="wrap page">
        <h1 className="h1">Вішліст</h1>
        <div className="tabs mt16">{([["mine", `Мій (${mine.length})`], ["partner", "Партнер"]] as const).map(([k, l]) =>
          <button key={k} type="button" className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}</div>

        {tab === "mine" ? (
          <>
            <div className="feature mt24" style={{ maxWidth: 760 }}>
              <span className="eyebrow acc"><span className="ms">redeem</span> Подарунки без спойлерів</span>
              <h2 className="h3">Поділіться вішлістом</h2>
              <p className="muted" style={{ margin: 0 }}>Надішліть посилання близьким. Коли хтось обере річ, інші побачать «Вже обрано». Що саме обрали, ви не дізнаєтеся.</p>
              <button className="btn" type="button" style={{ alignSelf: "flex-start" }} onClick={() => app.openModal("share")}>Поділитися вішлістом</button>
            </div>
            <div className="sec"><span className="eyebrow ink">{mine.length} {plural(mine.length, "річ", "речі", "речей")} з різних магазинів</span></div>
            {mine.length ? <div className="grid wide">{mine.map((p) => <ProductCard key={p.id} p={p} note={p.old ? `подешевшала на ${fmt(p.old - p.price)}` : undefined} />)}</div>
              : <div className="empty"><span className="ms">favorite</span><span>Тут з’являться речі, які ви позначите сердечком.</span><Link className="btn sm" href="/search">Знайти річ</Link></div>}
          </>
        ) : (
          <div className="mt24" style={{ maxWidth: 760 }}>
            {!s.partner ? (
              <div className="feature">
                <span className="eyebrow acc"><span className="ms">group</span> Доступ партнеру · PRO</span>
                <h2 className="h3">Партнер завжди знає, що вам подарувати</h2>
                <p className="muted" style={{ margin: 0 }}>Дайте доступ до свого вішліста. Партнер бачитиме все, що ви зберігаєте, і зможе обрати подарунок. Що саме він обрав, залишиться сюрпризом.</p>
                <form className="field" onSubmit={(e) => { e.preventDefault(); invite(); }}>
                  <input id="partner" value={pname} onChange={(e) => setPname(e.target.value)} placeholder="@username у Telegram або телефон" aria-label="Контакт партнера" />
                  <button className="btn sm" type="submit">Дати доступ</button>
                </form>
                <p className="small muted it" style={{ margin: 0 }}>Доступ можна закрити будь-коли.</p>
              </div>
            ) : (
              <div className="feature">
                <div className="between"><div className="stack g4"><span className="eyebrow acc"><span className="ms">group</span> Партнер</span><span className="h3">{s.partner.name}</span>
                  <span className={"small " + (s.partner.ok ? "note" : "muted")}>{s.partner.ok ? "Бачить ваш вішліст" : "Запрошення надіслано"}</span></div>
                  <span className="tgava">{(s.partner.name.replace(/^@/, "")[0] || "П").toUpperCase()}</span></div>
                <Link className="btn line" href="/w/anastasia?partner=1">Подивитися очима партнера</Link>
                <button className="btn ghost" type="button" onClick={() => { app.set({ partner: null }); app.toast("Доступ закрито"); }}>Закрити доступ</button>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
