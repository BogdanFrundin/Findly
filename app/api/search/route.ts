import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/search";

// GET /api/search?q=...&sort=match|price — used by the mobile app and future integrations.
export function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const sort = url.searchParams.get("sort") === "price" ? "price" : "match";
  const res = searchProducts(q, [], sort);
  return NextResponse.json({ parsed: res.parsed, total: res.list.length, items: res.list.map((x) => ({ ...x.p, match: x.m })) });
}
