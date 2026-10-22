"use client";
import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { ProductImage } from "@/components/Art";
import { useApp } from "@/components/AppState";
import { STORES, byId, productUrl } from "@/lib/catalog";
import { fmt, plural } from "@/lib/search";
import type { Product } from "@/lib/types";

export default function Cart() {
  const app = useApp();
  const cart = app.s.cart.filter((c) => byId[c.id]);
  if (!cart.length) return (
    <><Header /><main className="wrap narrow page" style={{ marginInline: "auto" }}>
      <h1 className="h1">Кошик</h1>
      <div className="empty mt24"><span className="ms">shopping_bag</span><span className="h3">Кошик порожній</span>
        <span>Натисніть «У кошик» на будь-якій речі. Звідси ви перейдете в магазини за покупкою.</span>
        <Link className="btn sm" href="/search">Перейти до пошуку</Link></div>
    </main><Footer /></>
  );
  const groups: Record<string, { p: Product; size: string }[]> = {};
  cart.forEach((c) => { const p = byId[c.id]; (groups[p.store] ||= []).push({ p, size: c.size }); });
  const total = cart.reduce((s, c) => s + byId[c.id].price, 0), nStores = Object.keys(groups).length;
  return (
    <>
      <Header />
      <main className="wrap page" style={{ maxWidth: 860 }}>
        <h1 className="h1">Кошик</h1>
        <p className="lead mt8">{cart.length} {plural(cart.length, "річ", "речі", "речей")} з {nStores} {plural(nStores, "магазину", "магазинів", "магазинів")}. Покупка й оплата відбуваються на сайті кожного магазину.</p>
        <div className="stack g16 mt24">
          {Object.entries(groups).map(([store, arr]) => (
            <div key={store} className="storegrp">
              <div className="head"><span className="h3">{store}</span><span className="price">{fmt(arr.reduce((a, x) => a + x.p.price, 0))}</span></div>
              {arr.map(({ p, size }) => (
                <div key={p.id} className="cartrow">
                  <Link href={`/product/${p.id}`} className="tile"><ProductImage p={p} /></Link>
                  <div className="stack g4" style={{ flex: 1, minWidth: 0 }}><span className="pname">{p.name}</span><span className="small muted">Розмір {size}</span><span className="price small">{fmt(p.price)}</span></div>
                  <button className="iconbtn" type="button" aria-label="Прибрати" onClick={() => app.toggleCart(p.id)}><span className="ms">close</span></button>
                </div>
              ))}
              <div style={{ padding: "12px 16px 16px" }}>
                <a className="btn block" href={arr.length === 1 ? productUrl(arr[0].p) : STORES[store as keyof typeof STORES]} target="_blank" rel="noopener">Перейти в {store} <span className="ms">north_east</span></a>
              </div>
            </div>
          ))}
        </div>
        <div className="panel mt24 between"><span className="eyebrow ink">Разом</span><span className="price" style={{ fontSize: 26 }}>{fmt(total)}</span></div>
      </main>
      <Footer />
    </>
  );
}
