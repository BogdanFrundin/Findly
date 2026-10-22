import { byId } from "./catalog";

export const QUIZ = [
  { k: "occ", q: "Для якої нагоди збираємо образ?", o: [["date", "Побачення"], ["office", "Офіс"], ["walk", "Прогулянка"], ["party", "Вечірка"]] },
  { k: "weather", q: "Яка буде погода?", o: [["warm", "Тепло"], ["cool", "Прохолодно"], ["cold", "Холодно"]] },
  { k: "colors", q: "Які кольори вам ближчі?", o: [["neutral", "Нейтральні"], ["dark", "Темні"], ["wine", "Бордо й вино"], ["light", "Світлі"]] },
  { k: "style", q: "А стиль?", o: [["classic", "Класика"], ["minimal", "Мінімалізм"], ["romantic", "Романтика"], ["sport", "Спорт-шик"]] },
  { k: "budget", q: "Який бюджет на весь образ?", o: [["3000", "до 3 000 ₴"], ["5000", "до 5 000 ₴"], ["8000", "до 8 000 ₴"]] },
] as const;

export type Answers = Partial<Record<(typeof QUIZ)[number]["k"], string>>;

const BASE: Record<string, string[]> = { date: ["b1", "t1", "p1", "l1"], office: ["b2", "bl2", "p4", "l2"], walk: ["s2", "j4", "k3"], party: ["d3", "bg3", "l1"] };
export const ALTS: Record<string, string> = { t1: "t2", t2: "t1", l1: "l2", l2: "l1", p1: "p4", p4: "p1", b1: "b2", b2: "b1", bl2: "t2", j4: "j1", j1: "j4", k3: "k2", k2: "k3", s2: "t1", c5: "c3", c3: "c5", d3: "d2", d2: "d3", bg3: "bg2", bg2: "bg3" };

export function buildLook(a: Answers) {
  let ids = (BASE[a.occ || "date"] || BASE.date).slice();
  if (a.weather === "cold") ids = ["c5", ...ids.filter((i) => !["b1", "b2"].includes(i))];
  if (a.weather === "cool" && !ids.some((i) => ["coat", "blazer"].includes(byId[i].cat))) ids.unshift("c3");
  const map = (m: Record<string, string>) => { ids = ids.map((i) => (i in m ? m[i] : i)).filter(Boolean); };
  if (a.colors === "dark") map({ t1: "t2", p4: "p1", k3: "l1", s2: "t2", bl2: "t2" });
  if (a.colors === "wine") map({ d3: "d2", bg3: "bg1", t1: "d2", p1: "", c3: "c5" });
  if (a.colors === "light") map({ t2: "t1", p1: "p4", l1: "l2", b1: "b2", c5: "c3" });
  if (a.style === "sport") map({ l1: "k1", l2: "k2" });
  if (a.style === "romantic") map({ p1: "sk1", p4: "sk1" });
  ids = [...new Set(ids)];
  const budget = Number(a.budget) || 5000;
  const total = () => ids.reduce((s, i) => s + byId[i].price, 0);
  for (let g = 0; g < 8 && total() > budget; g++) {
    const exp = ids.slice().sort((x, y) => byId[y].price - byId[x].price);
    let done = false;
    for (const i of exp) {
      const alt = ALTS[i];
      if (alt && byId[alt].price < byId[i].price && !ids.includes(alt)) { ids[ids.indexOf(i)] = alt; done = true; break; }
    }
    if (!done) break;
  }
  return { ids, budget };
}

export function lookTitle(a: Answers) {
  const o = ({ date: "на побачення", office: "в офіс", walk: "для прогулянки", party: "на вечірку" } as Record<string, string>)[a.occ || ""];
  const w = ({ warm: "теплу погоду", cool: "прохолодну погоду", cold: "холод" } as Record<string, string>)[a.weather || ""];
  const c = ({ neutral: "нейтральних тонах", dark: "темних тонах", wine: "відтінках бордо", light: "світлих тонах" } as Record<string, string>)[a.colors || ""];
  return `Образ ${o || ""}${w ? ", на " + w : ""}${c ? ", у " + c : ""}`;
}

export function lookFromText(text: string): Answers {
  const t = text.toLowerCase();
  const m = t.match(/до\s*([\d\s ]{3,})/);
  return {
    occ: /побачен|вечер|романт|свидан/.test(t) ? "date" : /офіс|робот|офис|работ/.test(t) ? "office" : /вечірк|клуб|свят|вечерин/.test(t) ? "party" : "walk",
    weather: /холод|зим|мороз/.test(t) ? "cold" : /прохолод|осін|тепл|прохлад/.test(t) ? "cool" : "warm",
    colors: /бордо|винн|бордов/.test(t) ? "wine" : /чорн|темн|ч[её]рн|т[её]мн/.test(t) ? "dark" : /світл|біл|пастел|светл|бел/.test(t) ? "light" : "neutral",
    style: /спорт/.test(t) ? "sport" : /романт|ніжн|нежн/.test(t) ? "romantic" : /мінімал|минимал/.test(t) ? "minimal" : "classic",
    budget: m ? String(parseInt(m[1].replace(/\D/g, ""), 10)) : "5000",
  };
}
