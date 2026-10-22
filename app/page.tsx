"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Footer, Header } from "@/components/Chrome";
import { Svg } from "@/components/Art";
import { useApp } from "@/components/AppState";
import { boutique } from "@/lib/art";

const SCENES = [0, 1, 2].map(boutique);

export default function Landing() {
  const { s, ready, openModal } = useApp();
  const [scene, setScene] = useState(0);
  useEffect(() => { const t = setInterval(() => setScene((v) => (v + 1) % 3), 5200); return () => clearInterval(t); }, []);
  useEffect(() => {
    if (!ready || s.cityAsked) return;
    const t = setTimeout(() => openModal("city"), 1400);
    return () => clearTimeout(t);
  }, [ready, s.cityAsked, openModal]);

  return (
    <>
      <section className="hero">
        {SCENES.map((html, i) => <div key={i} className={"scene" + (scene === i ? " on" : "")}><Svg html={html} /></div>)}
        <Header over />
        <div className="copy">
          <span className="eyebrow" style={{ color: "var(--champ)" }}>AI-пошук одягу</span>
          <h1 className="wordmark" style={{ margin: 0 }}>FINDLY</h1>
          <div className="tag">Опиши, що хочеш. Ми знайдемо.</div>
          <div className="ctas">
            <Link className="btn light" href="/search">Почати</Link>
            <a className="btn clear" href="#story">Наша історія</a>
          </div>
          <div className="dots">{[0, 1, 2].map((i) => <i key={i} className={scene === i ? "on" : ""} />)}</div>
        </div>
      </section>

      <section className="wrap narrow sect stack g16">
        <span className="eyebrow bur">Про сервіс</span>
        <h2 className="h1">Один рядок пошуку <i>замість десяти</i> магазинів</h2>
        <p className="lead">FINDLY шукає одяг одразу в Kasta, Intertop, Answear, Mango, COS та інших магазинах України. Ви описуєте річ своїми словами або показуєте фото, а ми знаходимо її, порівнюємо ціни й пояснюємо, чому вона підходить.</p>
      </section>

      <section className="story" id="story">
        <div className="wrap narrow stack g16">
          <span className="eyebrow">Наша історія</span>
          <h2 className="h1">Усе почалося <i>зі скриншота</i></h2>
          <p className="lead">Одного разу ми побачили в TikTok ідеальні джинси й витратили цілий вечір, щоб знайти схожі в Україні. Десятки вкладок, різні фільтри, різні назви того самого крою.</p>
          <p className="lead">Так з’явилася ідея FINDLY: сервіс, який розуміє звичайні слова й фото, знає українські магазини та сам знаходить найкращу ціну.</p>
          <p className="quote">«Ми хочемо, щоб знайти річ мрії було так само просто, як її описати».</p>
        </div>
      </section>

      <section className="wrap sect stack g16">
        <span className="eyebrow bur">Як це працює</span>
        <div className="steps">
          {[["Опишіть річ", "Словами, як подрузі: колір, крій, привід і бюджет. Або завантажте фото."],
            ["Порівняйте варіанти", "Схожі речі з різних магазинів, відсоток збігу та найкраща ціна."],
            ["Купуйте в магазині", "Додайте в кошик і переходьте в магазин. Для вас ціна та сама."]].map(([t, d], i) =>
            <div className="step" key={t}><span className="n">{i + 1}</span><span className="h3">{t}</span><span className="muted">{d}</span></div>)}
        </div>
      </section>

      <section className="wrap sect stack g16">
        <span className="eyebrow bur">Що вміє FINDLY</span>
        <div className="caps">
          {[["search", "Пошук словами", "Безкоштовно"], ["photo_camera", "Пошук за фото", "PRO"], ["auto_awesome", "AI-асистентка", "PRO"],
            ["checkroom", "Образи під привід", "Безкоштовно"], ["favorite", "Вішліст для партнера", "PRO"], ["notifications", "Ціни в Telegram", "PRO"]].map(([i, t, l]) =>
            <div key={t}><span className="ms">{i}</span><span className="h3" style={{ fontSize: 19 }}>{t}</span><span className="pro-tag">{l}</span></div>)}
        </div>
      </section>

      <section className="wrap narrow sect stack g16" style={{ alignItems: "center", textAlign: "center" }}>
        <div className="rule" />
        <h2 className="h2">Готові знайти свою річ?</h2>
        <p className="lead">Щоб почати, реєстрація не потрібна.</p>
        <Link className="btn" href="/search" style={{ minWidth: 260 }}>Почати</Link>
      </section>
      <Footer />
    </>
  );
}
