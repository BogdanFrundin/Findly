"use client";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Footer, Header } from "@/components/Chrome";
import { ProductImage } from "@/components/Art";
import { Heart, ProductCard } from "@/components/ProductCard";
import { useApp } from "@/components/AppState";
import { DESC, PRODUCTS, byId, hashN, offers, productUrl, sizesFor, STORES } from "@/lib/catalog";
import { shade } from "@/lib/art";
import { fmt } from "@/lib/search";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const p = byId[id];
  const router = useRouter();
  const app = useApp();
  const { s } = app;
  const [view, setView] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  if (!p) notFound();
  const sz = sizesFor(p), cur = size || app.defSize(p), tracked = !!s.tracked[p.id], inCart = app.inCart(p.id);
  const tones = [p.tone, shade(p.tone, 0.12), shade(p.tone, -0.1)];
  const comp = PRODUCTS.filter((x) => x.cat !== p.cat).sort((a, b) => hashN(a.id + p.id) - hashN(b.id + p.id)).slice(0, 4);

  const cartBtn = (
    <button className="btn" type="button" onClick={() => app.toggleCart(p.id, cur)}>
      {inCart ? <><span className="ms">check</span> У кошику</> : <>У кошик · {fmt(p.price)}</>}
    </button>
  );

  return (
    <>
      <Header />
      <main className="wrap page" style={{ paddingTop: 0 }}>
        <div className="row mob" style={{ height: 48 }}><button type="button" className="link" style={{ border: 0, padding: 0 }} onClick={() => router.back()}><span className="ms">arrow_back</span> Назад</button></div>
        <div className="small muted deskflex" style={{ height: 56, gap: 8, alignItems: "center" }}>
          <Link href="/">Головна</Link>/<Link href="/search">Пошук</Link>/<span>{p.store}</span>
        </div>
        <div className="pd">
          <div>
            <div className="gal">
              {p.old ? <span className="badge" style={{ top: 16, left: 16 }}>−{Math.round((1 - p.price / p.old) * 100)}%</span> : null}
              <ProductImage key={view} p={p} tone={tones[view]} scale={0.95} />
              <div className="prog">{tones.map((_, i) => <button key={i} type="button" className={i === view ? "on" : ""} aria-label={`Фото ${i + 1}`} onClick={() => setView(i)}><i /></button>)}</div>
            </div>
          </div>
          <div className="info stack g20">
            <div className="stack g12">
              <span className="store">{p.store}</span>
              <h1 className="h2">{p.name}</h1>
              <div className="row" style={{ alignItems: "baseline" }}><span className="price" style={{ fontSize: 30 }}>{fmt(p.price)}</span>{p.old ? <span className="old" style={{ fontSize: 16 }}>{fmt(p.old)}</span> : null}</div>
            </div>
            <div className="stack g12">
              <div className="between"><span className="eyebrow ink">Розмір{sz.length > 1 ? ": " + cur : ""}</span>
                <button className="link" type="button" onClick={() => app.openModal("sizes", { id: p.id, size: cur })}>Розмірна сітка</button></div>
              <div className="sizes">{sz.map((x, i) => <button key={x} type="button" className={cur === x || sz.length === 1 ? "on" : ""} disabled={i === sz.length - 1 && sz.length > 2} onClick={() => setSize(x)}>{x}</button>)}</div>
              <p className="small muted it" style={{ margin: 0 }}>{sz.length > 2 ? `Розмір ${sz[sz.length - 1]} закінчився · ` : ""}доставка в {s.city || "ваше місто"} 1–3 дні</p>
            </div>
            <div className="tray" style={{ gap: 8 }}>
              <Heart id={p.id} square />
              {cartBtn}
            </div>
            <div className="stack g8">
              <a className="btn ghost block" href={productUrl(p)} target="_blank" rel="noopener">Перейти в магазин {p.store} <span className="ms">north_east</span></a>
              <button className="btn line block" type="button" onClick={() => app.track(p)}>
                <span className={"ms" + (tracked ? " fill" : "")}>{tracked ? "notifications_active" : "notifications"}</span> {tracked ? "Стежу за ціною · " + fmt(s.tracked[p.id]) : "Стежити за ціною в Telegram"}
              </button>
            </div>
            <div className="panel sand stack g8"><span className="eyebrow ink">Опис від магазину</span><p style={{ margin: 0 }}>{DESC[p.cat]}</p><p className="small muted" style={{ margin: 0 }}>Склад: {p.mat}</p></div>
            <div>
              <div className="eyebrow ink" style={{ marginBottom: 12 }}>Ця річ в інших магазинах</div>
              <div className="rows">{offers(p).map((o) => (
                <div key={o.store}>
                  <div className="stack g4"><span style={{ fontWeight: 600 }}>{o.store}</span><span className={"small " + (o.best ? "note" : "muted")}>{o.best ? "Найнижча ціна" : "дорожче на " + fmt(o.price - p.price)}</span></div>
                  <a href={o.best ? productUrl(p) : STORES[o.store]} target="_blank" rel="noopener" className="row" style={{ gap: 8 }}><span className="price">{fmt(o.price)}</span><span className="ms">north_east</span></a>
                </div>))}</div>
            </div>
          </div>
        </div>
        <div className="sec" style={{ marginTop: 64 }}><span className="eyebrow ink">Доповнити образ</span><Link className="link" href="/looks">Образи</Link></div>
        <div className="grid wide">{comp.map((x) => <ProductCard key={x.id} p={x} />)}</div>
        <div className="pad-tray" />
      </main>
      <Footer />
    </>
  );
}
