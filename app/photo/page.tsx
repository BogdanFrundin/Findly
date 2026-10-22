"use client";
import { useRef, useState } from "react";
import { Footer, Header } from "@/components/Chrome";
import { ProductCard } from "@/components/ProductCard";
import { Svg } from "@/components/Art";
import { useApp } from "@/components/AppState";
import { PRODUCTS, byId, hashN } from "@/lib/catalog";
import { streetFigure } from "@/lib/art";
import { fmt, plural } from "@/lib/search";
import type { Category } from "@/lib/types";

const DET: Record<string, { l: string; n: string; box: React.CSSProperties }> = {
  coat: { l: "Тренч", n: "Двобортний тренч оверсайз", box: { left: "19%", top: "27%", width: "59%", height: "44%" } },
  trousers: { l: "Штани", n: "Широкі штани", box: { left: "30%", top: "68%", width: "41%", height: "28%" } },
  bag: { l: "Сумка", n: "Сумка-тоут", box: { left: "68%", top: "46%", width: "22%", height: "18%" } },
};
const UPCATS: [Category, string][] = [["coat", "Тренч або пальто"], ["jeans", "Джинси"], ["dress", "Сукня"], ["trousers", "Штани"], ["sneakers", "Кросівки"], ["bag", "Сумка"]];
const FIG = streetFigure();

export default function PhotoSearch() {
  const app = useApp();
  const [src, setSrc] = useState<string | null>(null);
  const [sel, setSel] = useState<string>("coat");
  const [tab, setTab] = useState<"similar" | "cheap" | "quality">("similar");
  const [over, setOver] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const load = (f?: File | null) => {
    if (!f || !/^image\//.test(f.type)) { app.toast("Потрібна картинка: JPG або PNG", "error"); return; }
    const rd = new FileReader();
    rd.onload = () => { setSrc(String(rd.result)); setSel("coat"); setTab("similar"); };
    rd.onerror = () => app.toast("Не вдалося відкрити фото, спробуйте інше", "error");
    rd.readAsDataURL(f);
  };
  const pick = () => app.need("pro", () => file.current?.click());
  const example = () => app.need("pro", () => { setSrc("example"); setSel("coat"); setTab("similar"); });

  if (!src) return (
    <>
      <Header />
      <main className="wrap page">
        <div className="two" style={{ alignItems: "center" }}>
          <div className="stack g16 fade">
            <span className="eyebrow bur"><span className="ms">photo_camera</span> Пошук за фото · PRO</span>
            <h1 className="h1">Завантажте фото — <i>знайдемо схоже</i></h1>
            <p className="lead">Скриншот із TikTok, Instagram або Pinterest. Ми розпізнаємо речі на фото й покажемо схожі в українських магазинах: найсхожіші, дешевші та якісніші.</p>
            <ul className="small muted" style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              <li>Найкраще працює фото, де річ видно повністю</li><li>Можна обрати одну річ або весь образ</li><li>Фото не зберігається</li>
            </ul>
          </div>
          <div className="stack g12">
            <div className={"drop" + (over ? " over" : "")} role="button" tabIndex={0} onClick={pick} onKeyDown={(e) => { if (e.key === "Enter") pick(); }}
              onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
              onDrop={(e) => { e.preventDefault(); setOver(false); app.need("pro", () => load(e.dataTransfer.files[0])); }}>
              <span className="ms">add_photo_alternate</span><span className="h3">Сфотографуйте або оберіть фото</span><span className="small muted">На телефоні відкриється камера або галерея · JPG, PNG</span>
            </div>
            <input ref={file} id="photo-file" type="file" accept="image/*" hidden onChange={(e) => load(e.target.files?.[0])} />
            <button type="button" className="btn line block" onClick={example}>Спробувати на прикладі</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );

  const up = src !== "example";
  const cat = (up ? sel : sel === "look" ? "look" : sel === "coat" ? "coat" : sel) as string;
  const items = cat === "look" ? ["c1", "p3", "bg1", "c3", "p4", "bg2"].map((i) => byId[i]) : PRODUCTS.filter((p) => p.cat === cat);
  const ranked = items.map((p, i) => ({ p, m: 96 - ((hashN(p.id) + i * 2) % 9) })).sort((x, y) => y.m - x.m);
  const top = ranked[0];
  const list = ranked.slice();
  if (tab === "cheap") list.sort((x, y) => x.p.price - y.p.price);
  if (tab === "quality") list.sort((x, y) => y.p.q - x.p.q || y.m - x.m);
  const min = list.length ? Math.min(...list.map((x) => x.p.price)) : 0;
  const label = cat === "look" ? "Весь образ" : up ? (UPCATS.find((c) => c[0] === cat) || [, ""])[1] : DET[cat]?.n;
  const note = (x: (typeof list)[number]) => tab === "cheap" ? (top && x.p.price < top.p.price ? `дешевше на ${fmt(top.p.price - x.p.price)}` : x === top ? "найсхожіше" : "") : tab === "quality" ? x.p.mat : "";

  return (
    <>
      <Header />
      <main className="wrap page">
        <div className="photo">
          <div className="shot stack g12">
            <div className="cropview">
              {up ? <img src={src} alt="Ваше фото" /> : <Svg html={FIG} />}
              {up ? null : Object.entries(DET).map(([k, v]) => (
                <button key={k} type="button" className={"det" + (sel === k || sel === "look" ? " on" : "")} style={v.box} aria-label={v.l} onClick={() => setSel(k)}><b>{v.l}</b></button>
              ))}
            </div>
            <div className="between"><span className="small muted">{up ? "Ваше фото" : "Приклад: скриншот із TikTok"}</span><button type="button" className="link" onClick={() => setSrc(null)}>Інше фото</button></div>
          </div>
          <div className="stack g20" style={{ minWidth: 0 }}>
            <div className="stack g12">
              <span className="eyebrow acc"><span className="ms">auto_awesome</span> {up ? "Що на фото?" : "Знайшли на фото 3 речі"}</span>
              <h1 className="h2">{label}</h1>
              <div className="chips">
                {up ? UPCATS.map(([k, l]) => <button key={k} type="button" className={"chip" + (sel === k ? " on" : "")} onClick={() => setSel(k)}>{l}</button>)
                  : <>{Object.entries(DET).map(([k, v]) => <button key={k} type="button" className={"chip" + (sel === k ? " on" : "")} onClick={() => setSel(k)}>{v.l}</button>)}
                    <button type="button" className={"chip" + (sel === "look" ? " on" : "")} onClick={() => setSel("look")}>Весь образ</button></>}
              </div>
            </div>
            <div>
              <div className="tabs">{([["similar", "Схоже"], ["cheap", "Дешевше"], ["quality", "Якісніше"]] as const).map(([k, l]) =>
                <button key={k} type="button" className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}</div>
              <p className="small muted mt12">{items.length} {plural(items.length, "варіант", "варіанти", "варіантів")} у {new Set(items.map((p) => p.store)).size} магазинах</p>
            </div>
            <div className="grid">{list.map((x) => <ProductCard key={x.p.id} p={x.p} match={x.m} badge={tab === "cheap" && x.p.price === min ? "Найкраща ціна" : undefined} note={note(x)} />)}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
