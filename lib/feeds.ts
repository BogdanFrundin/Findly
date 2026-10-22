/**
 * Partner feed mapping.
 *
 * Affiliate networks (Admitad, Indoleads, etc.) give each store's catalogue as a YML/XML or CSV feed.
 * scripts/import-feed.mjs downloads a feed, converts each offer with mapOffer() and writes data/products.json.
 * The site reads only data/products.json, so switching from demo to real products needs no other changes.
 */
import type { Category, Product, Shape, StoreName } from "./types";

export interface FeedOffer {
  id: string;
  name: string;
  price: number;
  oldprice?: number;
  url: string; // affiliate deeplink to the exact product
  picture?: string;
  category: string;
  color?: string;
  material?: string;
}

const CAT_RULES: [RegExp, Category, Shape][] = [
  [/джинс|jeans/i, "jeans", "pants"], [/сукн|плать|dress/i, "dress", "dress"], [/тренч|пальто|плащ|coat/i, "coat", "coat"],
  [/кросів|кеди|sneaker/i, "sneakers", "sneaker"], [/блейзер|піджак|жакет|blazer/i, "blazer", "blazer"],
  [/светр|джемпер|sweater/i, "sweater", "sweater"], [/штани|брюки|trousers/i, "trousers", "trousers"],
  [/лофер|туфл|взутт|shoes/i, "shoes", "loafer"], [/сумк|bag/i, "bag", "bag"], [/блуз|сорочк|blouse|shirt/i, "blouse", "blouse"],
  [/топ|top/i, "top", "top"], [/спідниц|skirt/i, "skirt", "skirt"], [/шарф|scarf/i, "scarf", "scarf"],
];

export function mapOffer(store: StoreName, o: FeedOffer): Product | null {
  const rule = CAT_RULES.find(([re]) => re.test(o.category) || re.test(o.name));
  if (!rule) return null;
  return {
    id: `${store.toLowerCase()}-${o.id}`,
    cat: rule[1],
    shape: rule[2],
    store,
    name: o.name,
    price: Math.round(o.price),
    old: o.oldprice && o.oldprice > o.price ? Math.round(o.oldprice) : undefined,
    tone: "#cbbba6",
    color: (o.color || "").toLowerCase(),
    attrs: [],
    q: 3,
    mat: o.material || "",
    url: o.url,
    image: o.picture,
  };
}
