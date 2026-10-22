"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useApp } from "./AppState";
import { ProductImage } from "./Art";
import { CITIES, byId, productUrl } from "@/lib/catalog";
import { fmt } from "@/lib/search";

function Sheet({ label, children, onClose }: { label: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={label}><div className="grab" />{children}</div>
    </div>
  );
}
function Head({ eyebrow, onClose }: { eyebrow: ReactNode; onClose: () => void }) {
  return <div className="between"><span className="eyebrow bur">{eyebrow}</span><button className="iconbtn" type="button" aria-label="Закрити" onClick={onClose}><span className="ms">close</span></button></div>;
}

export function Modals() {
  const app = useApp();
  const { s, set, modal, modalData, closeModal, resume, toast } = app;
  const router = useRouter();
  const [cityText, setCityText] = useState("");
  const [occasion, setOccasion] = useState("День народження");

  useEffect(() => {
    if (!modal) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [modal, closeModal]);

  if (!modal) return null;

  if (modal === "menu") {
    const go = (href: string) => { closeModal(); router.push(href); };
    return (
      <div className="overlay" style={{ alignItems: "stretch", justifyContent: "flex-start" }} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <nav className="drawer" aria-label="Меню">
          <div className="between"><span className="logo" style={{ paddingLeft: 0 }}>FINDLY</span><button className="iconbtn" type="button" aria-label="Закрити" onClick={closeModal}><span className="ms">close</span></button></div>
          <div className="items">
            {[["/search", "Пошук"], ["/assistant", "Асистентка"], ["/looks", "Образи"], ["/#story", "Про нас"], ["/", "На головну"]].map(([h, l]) =>
              <a key={h} href={h} onClick={(e) => { e.preventDefault(); go(h); }}>{l}</a>)}
          </div>
          <div className="stack g8" style={{ marginTop: "auto" }}><span className="eyebrow">Контакти</span><span className="small muted">0 800 000 000 · @findly_ua</span></div>
        </nav>
      </div>
    );
  }

  if (modal === "city") {
    const pick = (c: string) => { set({ city: c, cityAsked: true }); closeModal(); toast("Місто: " + c, "location_on"); };
    return (
      <Sheet label="Вибір міста" onClose={() => { set({ cityAsked: true }); closeModal(); }}>
        <span className="eyebrow bur">Ласкаво просимо</span>
        <h2 className="h2 mt8">Ваше місто</h2>
        <p className="lead mt8" style={{ fontSize: 16 }}>Покажемо доставку й речі, які є в наявності поруч із вами. Реєстрація не потрібна.</p>
        <div className="cities mt16">{CITIES.map((c) => <button key={c} type="button" className={"opt" + (s.city === c ? " on" : "")} onClick={() => pick(c)}>{c}</button>)}</div>
        <form className="field mt12" onSubmit={(e) => { e.preventDefault(); const v = cityText.trim(); if (v) pick(v[0].toUpperCase() + v.slice(1)); }}>
          <input id="city-other" value={cityText} onChange={(e) => setCityText(e.target.value)} placeholder="Інше місто" aria-label="Інше місто" />
          <button className="btn sm" type="submit">Обрати</button>
        </form>
        <button className="link mt16" type="button" style={{ display: "block", margin: "16px auto 0", color: "var(--muted)" }} onClick={() => { set({ cityAsked: true }); closeModal(); }}>Пізніше</button>
      </Sheet>
    );
  }

  if (modal === "login") {
    const login = () => { set({ logged: true }); toast("Ви увійшли як Анастасія", "person"); resume(); };
    return (
      <Sheet label="Вхід" onClose={closeModal}>
        <Head eyebrow="Вхід у FINDLY" onClose={closeModal} />
        <h2 className="h2 mt8">Увійдіть, щоб <i>зберегти</i></h2>
        <p className="lead mt8" style={{ fontSize: 16 }}>Акаунт потрібен для вішліста, стеження за ціною та пошуку за фото. Шукати й переглядати речі можна без нього.</p>
        <div className="stack g8 mt24">
          {[["send", "Продовжити з Telegram"], ["account_circle", "Продовжити з Google"], ["call", "За номером телефону"]].map(([i, l]) =>
            <button key={l} type="button" className="opt" onClick={login}><span className="ms">{i}</span>{l}</button>)}
        </div>
        <p className="small muted mt16 it" style={{ textAlign: "center" }}>Продовжуючи, ви погоджуєтеся з умовами сервісу.</p>
      </Sheet>
    );
  }

  if (modal === "pro") {
    return (
      <Sheet label="FINDLY PRO" onClose={closeModal}>
        <Head eyebrow="FINDLY PRO" onClose={closeModal} />
        <h2 className="h2 mt8">Ця функція — <i>у PRO</i></h2>
        <p className="lead mt8" style={{ fontSize: 16 }}>Асистентка, пошук за фото, доступ партнеру та ціни в Telegram. Перші 7 днів безкоштовно, потім {fmt(129)} на місяць.</p>
        <div className="stack g8 mt24">
          <button className="btn block" type="button" onClick={() => { set({ pro: true }); toast("FINDLY PRO: 7 днів безкоштовно", "auto_awesome"); resume(); }}>Спробувати 7 днів безкоштовно</button>
          <Link className="btn line block" href="/pro" onClick={closeModal}>Детальніше про PRO</Link>
        </div>
      </Sheet>
    );
  }

  if (modal === "tg") {
    return (
      <Sheet label="Підключення Telegram" onClose={closeModal}>
        <Head eyebrow={<><span className="ms">send</span> Сповіщення</>} onClose={closeModal} />
        <h2 className="h2 mt8">Ціни приходять <i>у Telegram</i></h2>
        <p className="lead mt8" style={{ fontSize: 16 }}>Підключіть бота FINDLY: він напише, щойно річ подешевшає до вашої цілі. Не потрібно заходити на сайт і перевіряти.</p>
        <div className="panel sand mt16 stack g8"><span className="small">1. Натисніть «Відкрити бота»</span><span className="small">2. У Telegram натисніть «Старт»</span><span className="small">3. Готово, сповіщення увімкнені</span></div>
        <div className="stack g8 mt24">
          <button className="btn block" type="button" onClick={app.connectTg}><span className="ms">send</span> Відкрити бота</button>
          <button className="btn line block" type="button" onClick={closeModal}>Не зараз</button>
        </div>
      </Sheet>
    );
  }

  if (modal === "sizes") {
    const p = byId[modalData.id];
    const cur = modalData.size;
    let head: string[], rows: string[][];
    if (p.cat === "shoes" || p.cat === "sneakers") { head = ["EU", "Довжина стопи", "UA"]; rows = [["36", "23,0 см", "36"], ["37", "23,7 см", "37"], ["38", "24,4 см", "38"], ["39", "25,0 см", "39"], ["40", "25,7 см", "40"]]; }
    else if (p.cat === "jeans") { head = ["W", "Талія", "Стегна"]; rows = [["25", "64 см", "90 см"], ["26", "67 см", "93 см"], ["27", "70 см", "96 см"], ["28", "73 см", "99 см"], ["29", "76 см", "102 см"]]; }
    else { head = ["Розмір", "Груди", "Талія", "Стегна"]; rows = [["XS", "82", "64", "90"], ["S", "86", "68", "94"], ["M", "90", "72", "98"], ["L", "96", "78", "104"], ["XL", "102", "84", "110"]]; }
    return (
      <Sheet label="Розмірна сітка" onClose={closeModal}>
        <Head eyebrow={p.store} onClose={closeModal} />
        <h2 className="h2 mt8">Розмірна сітка</h2>
        <p className="small muted mt8 it">Мірки тіла в сантиметрах, за даними магазину</p>
        <div style={{ overflowX: "auto" }}><table className="sz mt16"><thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]} className={r[0] === cur ? "on" : ""}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody></table></div>
        <p className="small muted mt16">Між розмірами? {p.cat === "coat" ? "Вільна модель: беріть менший." : "Беріть більший."}</p>
        <button className="btn block mt16" type="button" onClick={closeModal}>Зрозуміло</button>
      </Sheet>
    );
  }

  if (modal === "share") {
    const url = (typeof window !== "undefined" ? window.location.origin : "https://findly-inky.vercel.app") + "/w/anastasia";
    const text = "Мій вішліст на FINDLY. Обери подарунок, я не дізнаюся, що саме";
    const copy = () => { try { navigator.clipboard.writeText(url).then(() => toast("Посилання скопійовано"), () => toast("Скопіюйте вручну: " + url, "content_copy")); } catch { toast("Скопіюйте вручну: " + url, "content_copy"); } };
    return (
      <Sheet label="Поділитися вішлістом" onClose={closeModal}>
        <Head eyebrow="Вішліст" onClose={closeModal} />
        <h2 className="h2 mt8">Поділитися вішлістом</h2>
        <p className="lead mt8" style={{ fontSize: 16 }}>Посилання відкриється з написом «Вам надіслали вішліст».</p>
        <div className="chips scroll mt16">{["День народження", "Новий рік", "14 лютого", "8 березня", "Просто так"].map((o) =>
          <button key={o} type="button" className={"chip" + (occasion === o ? " on" : "")} onClick={() => setOccasion(o)}>{o}</button>)}</div>
        <div className="panel sand mt16"><span className="eyebrow bur"><span className="ms">lock</span> Режим сюрпризу</span><p className="small muted" style={{ margin: "8px 0 0" }}>Обрана річ стане «Вже обрано» для інших. Ви цього не побачите.</p></div>
        <div className="stack g8 mt16">
          <a className="opt" href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`} target="_blank" rel="noopener"><span className="ms">send</span>Надіслати в Telegram</a>
          <div className="opt" style={{ justifyContent: "space-between" }}><span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url.replace(/^https?:\/\//, "")}</span><button className="btn sm line" type="button" onClick={copy}>Скопіювати</button></div>
        </div>
        <Link className="btn block mt16" href="/w/anastasia" onClick={closeModal}>Подивитися очима гостя</Link>
      </Sheet>
    );
  }

  if (modal === "gift") {
    const p = byId[modalData.id];
    return (
      <Sheet label="Подарунок обрано" onClose={closeModal}>
        <Head eyebrow="Готово" onClose={closeModal} />
        <h2 className="h2 mt8">Подарунок обрано</h2>
        <p className="lead mt8" style={{ fontSize: 16 }}>Для інших він позначений «Вже обрано». Анастасія не дізнається, що ви обрали.</p>
        <div className="listrow mt16" style={{ background: "var(--ivory)" }}>
          <div className="tile"><ProductImage p={p} /></div>
          <div className="stack g4" style={{ minWidth: 0 }}><span className="store">{p.store}</span><span className="pname">{p.name}</span><span className="price">{fmt(p.price)}</span><span className="note">Закріплено за вами на 48 годин</span></div>
        </div>
        <div className="stack g8 mt16">
          <a className="btn block" href={productUrl(p)} target="_blank" rel="noopener">Перейти в магазин</a>
          <button className="btn line block" type="button" onClick={() => { set((st) => ({ chosen: st.chosen.filter((c) => c !== p.id), myGift: null })); closeModal(); toast("Вибір скасовано", "undo"); }}>Скасувати вибір</button>
        </div>
      </Sheet>
    );
  }
  return null;
}
