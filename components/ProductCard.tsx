"use client";
import Link from "next/link";
import { ProductImage } from "./Art";
import { useApp } from "./AppState";
import { fmt } from "@/lib/search";
import type { Product } from "@/lib/types";

export function Heart({ id, square }: { id: string; square?: boolean }) {
  const { s, toggleWish } = useApp();
  const on = s.logged && s.wish.includes(id);
  return (
    <button type="button" className={square ? "btn line" : "heart" + (on ? " on" : "")} style={square ? { width: 48, padding: 0, flex: "none" } : undefined}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWish(id); }}
      aria-label={on ? "Прибрати з вішліста" : "У вішліст"} aria-pressed={on}>
      <span className={"ms" + (on ? " fill" : "")}>favorite</span>
    </button>
  );
}

export function CartButton({ id }: { id: string }) {
  const { inCart, toggleCart } = useApp();
  const c = inCart(id);
  return (
    <button type="button" className={"addcart" + (c ? " in" : "")} onClick={() => toggleCart(id)}>
      {c ? <><span className="ms">check</span>У кошику</> : "У кошик"}
    </button>
  );
}

export function ProductCard({ p, match, badge, note, cart = true }: { p: Product; match?: number; badge?: string; note?: string; cart?: boolean }) {
  return (
    <article className="card">
      <Link href={`/product/${p.id}`} className="open">
        <div className="tile">
          <ProductImage p={p} />
          <Heart id={p.id} />
          {badge ? <span className="badge">{badge}</span> : p.old && !match ? <span className="badge lt btm">−{fmt(p.old - p.price)}</span> : null}
        </div>
        <div className="stack g4">
          <div className="meta"><span className="store">{p.store}</span>{match ? <span className="match">{match}%</span> : null}</div>
          <div className="pname">{p.name}</div>
          <div className="row" style={{ gap: 8, alignItems: "baseline" }}><span className="price">{fmt(p.price)}</span>{p.old ? <span className="old">{fmt(p.old)}</span> : null}</div>
          {note ? <div className="note">{note}</div> : null}
        </div>
      </Link>
      {cart ? <CartButton id={p.id} /> : null}
    </article>
  );
}
