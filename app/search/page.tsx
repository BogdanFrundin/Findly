"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer, Header } from "@/components/Chrome";
import { ProductCard } from "@/components/ProductCard";
import { SearchBox } from "@/components/SearchBox";
import { useApp } from "@/components/AppState";
import { Svg } from "@/components/Art";
import { PRODUCTS, byId } from "@/lib/catalog";
import { garmentSvg } from "@/lib/art";

const TRENDING = ["j1", "c1", "bg1", "k1", "d2", "s1"];
const SUGGEST = ["Чорна сукня міді", "Бордове пальто", "Білі кросівки", "Тренч до 3 000 ₴"];

export default function SearchHome() {
  const { s, openModal, need } = useApp();
  const router = useRouter();
  const drop = PRODUCTS.filter((p) => p.old).slice(0, 4);
  return (
    <>
      <Header />
      {s.city ? <div className="citybar">Доставка: {s.city} · <button type="button" onClick={() => openModal("city")}>змінити</button></div> : null}
      <main className="wrap page">
        <div className="narrow fade" style={{ marginInline: "auto", textAlign: "center" }}>
          <div className="eyebrow acc mt16"><span className="ms">auto_awesome</span> Пошук у всіх магазинах</div>
          <h1 className="h1 mt12">Що шукаємо <i>сьогодні?</i></h1>
          <div className="mt24" style={{ textAlign: "left" }}><SearchBox /></div>
          <div className="chips mt12" style={{ justifyContent: "center" }}>
            {SUGGEST.map((c) => <Link key={c} className="chip" href={"/results?q=" + encodeURIComponent(c)}>{c}</Link>)}
          </div>
          <button type="button" className="feature mt24" style={{ width: "100%", flexDirection: "row", alignItems: "center", textAlign: "left" }} onClick={() => need("pro", () => router.push("/assistant"))}>
            <span className="tgava">F</span>
            <span className="stack g4" style={{ flex: 1 }}><span className="h3" style={{ fontSize: 19 }}>Запитати асистентку</span><span className="small muted">«Що вдягнути на весілля подруги в листопаді?»</span></span>
            <span className="ms">chevron_right</span>
          </button>
        </div>

        <div className="sec"><span className="eyebrow ink">Зараз шукають</span><span className="eyebrow acc">Тренди тижня</span></div>
        <div className="carousel">{TRENDING.map((id) => <ProductCard key={id} p={byId[id]} />)}</div>

        <div className="sec"><span className="eyebrow ink">Подешевшало</span><Link className="link" href="/results?q=знижки">Усі</Link></div>
        <div className="grid wide">{drop.map((p) => <ProductCard key={p.id} p={p} />)}</div>

        <div className="sec"><span className="eyebrow ink">Образ тижня</span></div>
        <Link href="/looks" style={{ display: "block", position: "relative", overflow: "hidden", background: "linear-gradient(170deg,#5a2430,#24150f)", minHeight: 420 }}>
          <div className="board" style={{ position: "absolute", inset: "8% 14% 32%", background: "transparent", gap: 10, maxWidth: 520, marginInline: "auto" }}>
            {["c5", "s1", "p3", "l1"].map((i) => <div key={i} className="tile" style={{ background: "rgba(246,240,232,.93)" }}><Svg html={garmentSvg(byId[i].shape, byId[i].tone, { floor: false, scale: 0.9 })} /></div>)}
          </div>
          <div className="stack g8" style={{ position: "absolute", left: 24, right: 24, bottom: 24, color: "#f6f0e8" }}>
            <span className="eyebrow" style={{ color: "var(--champ)" }}>Капсула з 4 речей</span>
            <span className="h2">Бордо й кашемір</span>
            <span className="link" style={{ alignSelf: "flex-start", color: "#f6f0e8" }}>Зібрати свій образ</span>
          </div>
        </Link>
      </main>
      <Footer />
    </>
  );
}
