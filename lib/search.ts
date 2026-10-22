import { PRODUCTS, hashN } from "./catalog";
import type { Category, Product } from "./types";

export const fmt = (n: number) => Math.round(n).toLocaleString("uk-UA").replace(/\s/g, " ") + " ₴";
export function plural(n: number, one: string, few: string, many: string) {
  const m = n % 10, h = n % 100;
  return m === 1 && h !== 11 ? one : m >= 2 && m <= 4 && (h < 12 || h > 14) ? few : many;
}

const CATS: [RegExp, Category, string][] = [
  [/джинс/, "jeans", "Джинси"], [/сукн|плать/, "dress", "Сукня"], [/тренч|пальто|плащ/, "coat", "Тренч і пальто"],
  [/кросів|кросов|кед/, "sneakers", "Кросівки"], [/блейзер|піджак|пиджак|жакет/, "blazer", "Блейзер"],
  [/джемпер|светр|свитер/, "sweater", "Светр"], [/штан|брюк/, "trousers", "Штани"],
  [/лофер|туфл|взутт|обув/, "shoes", "Взуття"], [/сумк/, "bag", "Сумка"], [/блуз|сорочк|рубаш/, "blouse", "Блуза"],
  [/(^|\s)топ/, "top", "Топ"], [/спідниц|юбк/, "skirt", "Спідниця"], [/шарф/, "scarf", "Шарф"],
];
const COLORS: [RegExp, string][] = [
  [/блакит|голуб/, "блакитний"], [/синій|сині|синю|синий/, "синій"], [/чорн|ч[её]рн/, "чорний"], [/біл|бел/, "білий"],
  [/беж|пісоч|песоч/, "бежевий"], [/бордо|бордов|винн/, "бордовий"], [/кемел|кэмел|верблюж/, "кемел"], [/сір(ий|і|у)|сер(ый|ые|ую)/, "сірий"],
];
const ATTRS: [RegExp, string][] = [
  [/широк|wide|палацо|палаццо/, "широкий крій"], [/прям/, "прямий крій"], [/висок|высок/, "висока посадка"],
  [/міді|миди/, "міді"], [/оверсайз|oversize/, "оверсайз"], [/дорог|преміум|премиум|благород|шляхетн/, "преміум-вигляд"], [/шкір|кож/, "шкіра"],
];

export interface Parsed {
  cat: Category | null; catLabel: string | null; color: string | null; attrs: string[]; budget: number | null;
  chips: { k: string; l: string }[];
}

export function parseQuery(q: string): Parsed {
  const t = q.toLowerCase();
  const r: Parsed = { cat: null, catLabel: null, color: null, attrs: [], budget: null, chips: [] };
  for (const [re, c, l] of CATS) if (re.test(t)) { r.cat = c; r.catLabel = l; break; }
  for (const [re, c] of COLORS) if (re.test(t)) { r.color = c; break; }
  for (const [re, a] of ATTRS) if (re.test(t)) r.attrs.push(a);
  const m = t.match(/до\s*([\d\s ]{3,})/);
  if (m) { const v = parseInt(m[1].replace(/\D/g, ""), 10); if (v > 200) r.budget = v; }
  if (r.cat) r.chips.push({ k: "cat", l: r.catLabel! });
  if (r.color) r.chips.push({ k: "color", l: r.color[0].toUpperCase() + r.color.slice(1) });
  r.attrs.forEach((a) => r.chips.push({ k: "a:" + a, l: a[0].toUpperCase() + a.slice(1) }));
  if (r.budget) r.chips.push({ k: "budget", l: "до " + fmt(r.budget) });
  return r;
}

export function scoreP(p: Product, r: Pick<Parsed, "cat" | "color" | "attrs">) {
  let s = 70;
  if (r.cat && p.cat === r.cat) s += 10;
  if (r.color && p.color === r.color) s += 7;
  r.attrs.forEach((a) => { if (p.attrs.includes(a)) s += 4; });
  return Math.min(97, s + (hashN(p.id) % 4));
}

export interface SearchResult {
  parsed: Parsed; list: { p: Product; m: number }[]; min: number; over: boolean; stores: number;
}

export function searchProducts(q: string, removed: string[] = [], sort: "match" | "price" = "match"): SearchResult {
  const r = parseQuery(q), rm = new Set(removed);
  const eff = {
    cat: rm.has("cat") ? null : r.cat,
    color: rm.has("color") ? null : r.color,
    attrs: r.attrs.filter((a) => !rm.has("a:" + a)),
    budget: rm.has("budget") ? null : r.budget,
  };
  let list = PRODUCTS.filter((p) => !eff.cat || p.cat === eff.cat);
  if (eff.color) {
    const c = list.filter((p) => p.color === eff.color || (eff.color === "блакитний" && p.color === "синій"));
    if (c.length) list = c;
  }
  let over = false;
  if (eff.budget) { const b = list.filter((p) => p.price <= eff.budget!); if (b.length) list = b; else over = true; }
  if (!r.cat && !r.color && !r.attrs.length) list = /знижк|подешев|скидк|sale/i.test(q) ? PRODUCTS.filter((p) => p.old) : PRODUCTS.slice(0, 12);
  const scored = list.map((p) => ({ p, m: scoreP(p, eff) }));
  scored.sort(sort === "price" ? (a, b) => a.p.price - b.p.price : (a, b) => b.m - a.m);
  const min = scored.length ? Math.min(...scored.map((x) => x.p.price)) : 0;
  return { parsed: r, list: scored, min, over, stores: new Set(scored.map((x) => x.p.store)).size };
}
