export type Category =
  | "jeans" | "dress" | "coat" | "blazer" | "sweater" | "top" | "blouse"
  | "trousers" | "skirt" | "shoes" | "sneakers" | "bag" | "scarf";

export type Shape =
  | "pants" | "straight" | "trousers" | "dress" | "sheath" | "slip" | "coat" | "blazer"
  | "sweater" | "blouse" | "top" | "skirt" | "loafer" | "sneaker" | "bag" | "scarf";

/** One product as FINDLY shows it. Partner feeds are mapped into this shape (see lib/feeds.ts). */
export interface Product {
  id: string;
  cat: Category;
  shape: Shape;
  store: StoreName;
  name: string;
  price: number;
  old?: number;
  /** Main colour of the item, used for the illustration until real photos arrive. */
  tone: string;
  color: string;
  attrs: string[];
  /** Quality score 1–5 used by the "Якісніше" sort. */
  q: number;
  mat: string;
  /** Direct link to this item in the store (affiliate link once a partner programme is active). */
  url?: string;
  /** Real photo from the feed. When empty the site draws an illustration. */
  image?: string;
}

export type StoreName = "Kasta" | "Intertop" | "Answear" | "Mango" | "COS";

export interface CartItem { id: string; size: string }
