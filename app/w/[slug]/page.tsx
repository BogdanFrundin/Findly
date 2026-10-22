"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Footer, Header } from "@/components/Chrome";
import { ProductImage } from "@/components/Art";
import { useApp } from "@/components/AppState";
import { FRIEND_LIST, byId, productUrl } from "@/lib/catalog";
import { fmt } from "@/lib/search";

function Guest() {
  const app = useApp();
  const { s } = app;
  const partner = useSearchParams().get("partner") === "1";
  const items = FRIEND_LIST.map((i) => byId[i]);
  const choose = (id: string) => {
    app.set((st) => ({ chosen: [...st.chosen.filter((c) => c !== st.myGift), id], myGift: id }));
    app.openModal("gift", { id });
  };
  return (
    <main className="wrap page">
      <span className="eyebrow acc"><span className="ms">redeem</span> {partner ? "Анастасія дала вам доступ" : "Вам надіслали вішліст"}</span>
      <h1 className="h1 mt12">Вішліст Анастасії</h1>
      <p className="eyebrow mt8">{partner ? "Оновлюється, коли вона зберігає речі" : "До дня народження"} · {items.length} речей</p>
      <div className="panel mt16" style={{ maxWidth: 760 }}><p style={{ margin: 0 }}>Оберіть річ у подарунок. Для інших гостей вона буде позначена «Вже обрано», а Анастасія не дізнається, що ви обрали.</p></div>
      <div className="grid wide mt32">
        {items.map((p) => {
          const mine = s.myGift === p.id, taken = s.chosen.includes(p.id) && !mine;
          return (
            <div key={p.id} className={"card" + (taken ? " chosen" : "")}>
              <div className="tile"><ProductImage p={p} /><span className={"badge" + (taken ? "" : " lt")}>{taken ? "Вже обрано" : mine ? "Ваш подарунок" : "Вільно"}</span></div>
              <div className="stack g4"><span className="store">{p.store}</span><div className="pname">{p.name}</div><span className="price">{fmt(p.price)}</span></div>
              {taken ? <button type="button" className="btn sm dim block" disabled>Вже обрано</button>
                : mine ? <a className="btn sm esp block" href={productUrl(p)} target="_blank" rel="noopener">У магазин</a>
                  : <button type="button" className="btn sm block" onClick={() => choose(p.id)}>Обрати</button>}
            </div>
          );
        })}
      </div>
      <div className="panel mt32 small muted it" style={{ textAlign: "center" }}>Для вас це безкоштовно: ви купуєте в магазині за звичайною ціною.</div>
    </main>
  );
}

export default function GuestWishlist() {
  return (<><Header /><Suspense fallback={null}><Guest /></Suspense><Footer /></>);
}
