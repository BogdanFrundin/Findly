"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "./AppState";

const NAV = [["/search", "Пошук"], ["/assistant", "Асистентка"], ["/looks", "Образи"], ["/wishlist", "Вішліст"]] as const;

export function Header({ over = false }: { over?: boolean }) {
  const { s, openModal, ready } = useApp();
  const path = usePathname();
  return (
    <header className={"hdr" + (over ? " over" : "")}>
      <div className="wrap">
        <div className="left">
          <button className="iconbtn" type="button" aria-label="Меню" onClick={() => openModal("menu")}><span className="ms">menu</span></button>
          <nav className="mainnav" aria-label="Розділи">
            {NAV.map(([href, l]) => <Link key={href} href={href} className={path.startsWith(href) ? "on" : ""}>{l}</Link>)}
          </nav>
        </div>
        <Link href="/" className="logo" aria-label="FINDLY, на головну">FINDLY</Link>
        <div className="right">
          <Link href="/cart" className="iconbtn desk" aria-label="Кошик"><span className="ms">shopping_bag</span>{s.cart.length ? <span className="cnt">{s.cart.length}</span> : null}</Link>
          {ready && s.logged
            ? <Link href="/profile" aria-label="Профіль" style={{ marginLeft: 6 }}><span className="avatar">А</span></Link>
            : <button className="signin" type="button" onClick={() => openModal("login")}>Увійти</button>}
        </div>
      </div>
    </header>
  );
}

const TABS = [["/search", "search", "Пошук"], ["/looks", "auto_awesome", "Образи"], ["/wishlist", "favorite", "Вішліст"], ["/cart", "shopping_bag", "Кошик"]] as const;

export function TabBar() {
  const { s } = useApp();
  const path = usePathname();
  const hidden = path === "/" || path.startsWith("/w/");
  useEffect(() => { document.body.classList.toggle("has-tabbar", !hidden); }, [hidden]);
  if (hidden) return null;
  const active = path.startsWith("/product") || path.startsWith("/results") || path.startsWith("/photo") ? "/search" : path.startsWith("/assistant") ? "/looks" : path;
  return (
    <nav className="tabbar" aria-label="Основне меню">
      {TABS.map(([href, icon, l]) => {
        const on = active.startsWith(href);
        return (
          <Link key={href} href={href} className={on ? "on" : ""}>
            <span className={"ms" + (on ? " fill" : "")}>{icon}</span>{l}
            {href === "/cart" && s.cart.length ? <span className="cnt">{s.cart.length}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap cols">
        <div className="stack g8">
          <span className="logo" style={{ paddingLeft: 0, justifySelf: "start", fontSize: 26 }}>FINDLY</span>
          <p className="it" style={{ margin: 0, color: "rgba(246,240,232,.7)" }}>AI-пошук одягу в магазинах України</p>
          <p className="small" style={{ margin: "16px 0 0", color: "rgba(246,240,232,.5)" }}>Покупка й оплата відбуваються на сайтах магазинів.</p>
        </div>
        <div>
          <div className="eyebrow">Контакти</div>
          <div className="rows mt12">
            <div><span>Гаряча лінія</span><span className="sel">0 800 000 000</span></div>
            <div><span>Telegram</span><span className="sel">@findly_ua</span></div>
            <div><span>Instagram</span><span className="sel">@findly.ua</span></div>
            <div><span>Пошта</span><span className="sel">hello@findly.ua</span></div>
          </div>
        </div>
        <div>
          <div className="eyebrow">Сервіс</div>
          <div className="rows mt12">
            <Link href="/search"><span>Пошук</span><span>→</span></Link>
            <Link href="/photo"><span>Пошук за фото</span><span>→</span></Link>
            <Link href="/looks"><span>Образи</span><span>→</span></Link>
            <Link href="/pro"><span>FINDLY PRO</span><span>→</span></Link>
          </div>
        </div>
      </div>
      <div className="wrap small mt32" style={{ color: "rgba(246,240,232,.45)" }}>© 2026 FINDLY</div>
    </footer>
  );
}
