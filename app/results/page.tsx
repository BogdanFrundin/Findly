"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Footer, Header } from "@/components/Chrome";
import { ProductCard } from "@/components/ProductCard";
import { SearchBox } from "@/components/SearchBox";
import { useApp } from "@/components/AppState";
import { fmt, plural, searchProducts } from "@/lib/search";

function Results() {
  const q = useSearchParams().get("q") || "";
  const { s } = useApp();
  const [removed, setRemoved] = useState<string[]>([]);
  const [sort, setSort] = useState<"match" | "price">("match");
  const [parsing, setParsing] = useState(true);
  useEffect(() => { setRemoved([]); setParsing(true); const t = setTimeout(() => setParsing(false), 1500); return () => clearTimeout(t); }, [q]);
  const res = useMemo(() => searchProducts(q, removed, sort), [q, removed, sort]);
  const n = res.list.length;
  const toggle = (k: string) => setRemoved((r) => (r.includes(k) ? r.filter((x) => x !== k) : [...r, k]));

  return (
    <main className="wrap page">
      <SearchBox key={q} initial={q} />
      {parsing ? (
        <div className="stack g20 mt24 fade">
          <div className="loadline" />
          <div className="stack g8"><h2 className="h2 it">Розбираємо запит…</h2><p className="lead">Дивимося на річ, колір, крій і бюджет. Шукаємо в Kasta, Intertop, Answear, Mango, COS.</p></div>
          <div className="chips">{res.parsed.chips.map((c, i) => <span key={c.k} className="chip parse" style={{ animationDelay: `${0.15 + i * 0.14}s` }}><span className="ms">check</span>{c.l}</span>)}</div>
          <div className="grid wide">{[0, 1, 2, 3].map((i) => <div key={i} className="stack g12"><div className="skel" /><div className="skel" style={{ aspectRatio: "auto", height: 14, width: "60%" }} /></div>)}</div>
        </div>
      ) : (
        <>
          <div className="stack g8 mt24">
            <span className="eyebrow acc">FINDLY зрозумів так</span>
            <div className="chips">
              {res.parsed.chips.length ? res.parsed.chips.map((c) => {
                const off = removed.includes(c.k);
                return <button key={c.k} type="button" className={"chip" + (off ? "" : " on")} aria-pressed={!off} onClick={() => toggle(c.k)}>{c.l}<span className="ms">{off ? "add" : "close"}</span></button>;
              }) : <span className="small muted">Запит загальний, показуємо популярне</span>}
            </div>
          </div>
          <div className="toolbar">
            <span className="small muted num">{n} {plural(n, "річ", "речі", "речей")} з {res.stores} {plural(res.stores, "магазину", "магазинів", "магазинів")}</span>
            <label className="eyebrow ink row" style={{ gap: 6 }}>Сортування
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as "match" | "price")}><option value="match">збіг</option><option value="price">ціна</option></select>
            </label>
          </div>
          {res.over ? <div className="panel small" style={{ marginBottom: 24 }}>У цей бюджет нічого не знайшли. Показуємо найближчі варіанти.</div> : null}
          <div className="grid wide">{res.list.map((x) => <ProductCard key={x.p.id} p={x.p} match={x.m} badge={x.p.price === res.min && n > 1 ? "Найкраща ціна" : undefined} />)}</div>
          <p className="small muted it mt32" style={{ textAlign: "center" }}>Ціни оновлено сьогодні · Доставка: {s.city || "по Україні"}{res.parsed.budget ? ` · бюджет ${fmt(res.parsed.budget)}` : ""}</p>
        </>
      )}
    </main>
  );
}

export default function ResultsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<main className="wrap page"><div className="loadline" /></main>}><Results /></Suspense>
      <Footer />
    </>
  );
}
