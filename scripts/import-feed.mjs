#!/usr/bin/env node
/**
 * Import a partner product feed (YML/XML, the format Admitad and most UA stores use)
 * into data/products.json.
 *
 * Usage:
 *   node scripts/import-feed.mjs --store Kasta --url "https://…/feed.xml"
 *   node scripts/import-feed.mjs --store Kasta --file ./kasta.xml --append
 *
 * --append keeps products from other stores already in data/products.json.
 */
import fs from "node:fs";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith("--") ? [...acc, [a.slice(2), arr[i + 1]?.startsWith("--") || arr[i + 1] === undefined ? true : arr[i + 1]]] : acc), [])
);
if (!args.store || (!args.url && !args.file)) {
  console.error("Usage: --store <Kasta|Intertop|Answear|Mango|COS> (--url <feed> | --file <path>) [--append]");
  process.exit(1);
}

const xml = args.url ? await (await fetch(args.url)).text() : fs.readFileSync(args.file, "utf8");
const tag = (src, name) => (src.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`)) || [])[1]?.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
const cats = Object.fromEntries([...xml.matchAll(/<category id="([^"]+)"[^>]*>([^<]+)<\/category>/g)].map((m) => [m[1], m[2]]));

const RULES = [
  [/джинс|jeans/i, "jeans", "pants"], [/сукн|плать|dress/i, "dress", "dress"], [/тренч|пальто|плащ|coat/i, "coat", "coat"],
  [/кросів|кеди|sneaker/i, "sneakers", "sneaker"], [/блейзер|піджак|жакет|blazer/i, "blazer", "blazer"],
  [/светр|джемпер|sweater/i, "sweater", "sweater"], [/штани|брюки|trousers/i, "trousers", "trousers"],
  [/лофер|туфл|взутт|shoes/i, "shoes", "loafer"], [/сумк|bag/i, "bag", "bag"], [/блуз|сорочк|blouse|shirt/i, "blouse", "blouse"],
  [/топ|top/i, "top", "top"], [/спідниц|skirt/i, "skirt", "skirt"], [/шарф|scarf/i, "scarf", "scarf"],
];

const products = [];
for (const m of xml.matchAll(/<offer\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/offer>/g)) {
  const [_, id, body] = m;
  const name = tag(body, "name") || tag(body, "model") || "";
  const category = cats[tag(body, "categoryId")] || "";
  const rule = RULES.find(([re]) => re.test(category) || re.test(name));
  if (!rule) continue;
  const price = Number(tag(body, "price"));
  const old = Number(tag(body, "oldprice")) || undefined;
  const color = (body.match(/<param name="(Колір|Цвет|Color)">([^<]+)</i) || [])[2] || "";
  const mat = (body.match(/<param name="(Склад|Состав|Material)">([^<]+)</i) || [])[2] || "";
  products.push({
    id: `${args.store.toLowerCase()}-${id}`, cat: rule[1], shape: rule[2], store: args.store, name, price,
    ...(old && old > price ? { old } : {}), tone: "#cbbba6", color: color.toLowerCase(), attrs: [], q: 3, mat,
    url: tag(body, "url") || "", image: tag(body, "picture") || "",
  });
}

const file = new URL("../data/products.json", import.meta.url);
const existing = args.append ? JSON.parse(fs.readFileSync(file, "utf8")).filter((p) => p.store !== args.store) : [];
fs.writeFileSync(file, JSON.stringify([...existing, ...products], null, 1));
console.log(`Imported ${products.length} products from ${args.store}. Total: ${existing.length + products.length}.`);
