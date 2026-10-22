"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBox({ initial = "", id = "q" }: { initial?: string; id?: string }) {
  const [q, setQ] = useState(initial);
  const router = useRouter();
  const submit = (v: string) => {
    v = v.trim();
    if (!v) return;
    if (/образ/i.test(v) && !/джинс|сукн|плать|тренч|пальто|штан|брюк/i.test(v)) { router.push("/looks?q=" + encodeURIComponent(v)); return; }
    router.push("/results?q=" + encodeURIComponent(v));
  };
  return (
    <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); submit(q); }}>
      <span className="ms">search</span>
      <input id={id} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Наприклад: блакитні широкі джинси до 2 500 ₴" aria-label="Що шукаємо" enterKeyHint="search" />
      <Link href="/photo" className="iconbtn" aria-label="Пошук за фото"><span className="ms">photo_camera</span></Link>
      <button className="btn sm desk" type="submit">Знайти</button>
    </form>
  );
}
