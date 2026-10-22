"use client";
import { Footer, Header } from "@/components/Chrome";
import { Svg } from "@/components/Art";
import { useApp } from "@/components/AppState";
import { garmentSvg } from "@/lib/art";
import { fmt } from "@/lib/search";

const FEATS = [
  ["auto_awesome", "AI-асистентка", "Питайте, що вдягнути, і отримуйте добірки"],
  ["photo_camera", "Пошук за фото", "Скриншот із TikTok — і річ знайдено"],
  ["group", "Доступ партнеру", "Він бачить ваш вішліст і знає, що подарувати"],
  ["notifications", "Ціни в Telegram", "Напишемо, коли річ подешевшає до цілі"],
];

export default function Pro() {
  const app = useApp();
  return (
    <>
      <Header />
      <main className="wrap page">
        <div className="two" style={{ alignItems: "center" }}>
          <div className="prohero">
            <Svg html={garmentSvg("coat", "#c8ad86", { scale: 1, dy: -24 })} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(36,21,15,.35),transparent 35%,rgba(36,21,15,.9))" }} />
            <div className="stack g8" style={{ position: "absolute", left: 20, right: 20, bottom: 28, color: "#f6f0e8", textAlign: "center" }}>
              <span className="eyebrow" style={{ color: "var(--champ)" }}>Підписка</span>
              <span style={{ font: "500 clamp(40px,5vw,60px)/1 var(--serif)", letterSpacing: ".2em", paddingLeft: ".2em" }}>FINDLY PRO</span>
            </div>
          </div>
          <div className="stack g20">
            <p className="lead it" style={{ fontSize: 20 }}>Усе, що робить пошук по-справжньому особистим.</p>
            <div className="hair" />
            {FEATS.map(([i, t, d]) => <div key={t} className="feat"><span className="ic"><span className="ms">{i}</span></span><div className="stack g4"><span className="h3" style={{ fontSize: 19 }}>{t}</span><span className="small muted">{d}</span></div></div>)}
            <div className="panel sand stack g12">
              <div className="between"><span className="eyebrow">Тариф на місяць</span><span className="eyebrow bur">7 днів безкоштовно</span></div>
              <div><span className="num" style={{ font: "500 42px/1 var(--serif)" }}>{fmt(129)}</span> <span className="muted">/ місяць</span></div>
              {app.s.pro ? <div className="btn esp block" style={{ cursor: "default" }}><span className="ms">check</span> PRO активний</div>
                : <button className="btn block" type="button" onClick={() => app.need("login", () => { app.set({ pro: true }); app.toast("FINDLY PRO: 7 днів безкоштовно", "auto_awesome"); })}>Спробувати 7 днів безкоштовно</button>}
              <p className="small muted it" style={{ margin: 0, textAlign: "center" }}>Скасувати можна будь-коли в профілі.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
