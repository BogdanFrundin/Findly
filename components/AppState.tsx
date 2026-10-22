"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { byId, sizesFor } from "@/lib/catalog";
import { fmt } from "@/lib/search";
import type { CartItem, Product } from "@/lib/types";

export type ModalName = "city" | "login" | "pro" | "tg" | "menu" | "sizes" | "share" | "gift";

export interface Persisted {
  logged: boolean; pro: boolean; tg: boolean; city: string | null; cityAsked: boolean;
  wish: string[]; cart: CartItem[]; tracked: Record<string, number>;
  partner: { name: string; ok: boolean } | null; chosen: string[]; myGift: string | null;
  sizes: { top: string; bottom: string; shoes: string }; styles: string[]; favStores: string[]; budget: number;
}

const DEFAULTS: Persisted = {
  logged: false, pro: false, tg: false, city: null, cityAsked: false,
  wish: [], cart: [], tracked: {}, partner: null, chosen: ["c2"], myGift: null,
  sizes: { top: "S", bottom: "27", shoes: "38" }, styles: ["Мінімалізм", "Класика"], favStores: ["Kasta", "COS", "Answear"], budget: 5000,
};
const KEY = "findly:v1";

interface Ctx {
  s: Persisted; ready: boolean;
  set: (p: Partial<Persisted> | ((s: Persisted) => Partial<Persisted>)) => void;
  modal: ModalName | null; modalData: Record<string, string>;
  openModal: (m: ModalName, data?: Record<string, string>) => void; closeModal: () => void;
  need: (level: "login" | "pro", fn: () => void) => void; resume: () => void;
  toast: (text: string, icon?: string) => void;
  toggleWish: (id: string) => void; inCart: (id: string) => boolean; toggleCart: (id: string, size?: string) => void;
  defSize: (p: Product) => string; track: (p: Product) => void; connectTg: () => void;
}
const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => { const c = useContext(AppCtx); if (!c) throw new Error("useApp outside provider"); return c; };

export function AppProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Persisted>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState<ModalName | null>(null);
  const [modalData, setModalData] = useState<Record<string, string>>({});
  const [toastMsg, setToastMsg] = useState<{ text: string; icon: string; n: number } | null>(null);
  const pending = useRef<{ level: "login" | "pro"; fn: () => void } | null>(null);
  const afterTg = useRef<(() => void) | null>(null);
  const sRef = useRef(s); sRef.current = s;

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS({ ...DEFAULTS, ...JSON.parse(raw) }); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} } }, [s, ready]);

  const set = useCallback((p: Partial<Persisted> | ((s: Persisted) => Partial<Persisted>)) =>
    setS((prev) => ({ ...prev, ...(typeof p === "function" ? p(prev) : p) })), []);

  const toast = useCallback((text: string, icon = "check") => {
    setToastMsg({ text, icon, n: Date.now() });
  }, []);
  useEffect(() => { if (!toastMsg) return; const t = setTimeout(() => setToastMsg(null), 2800); return () => clearTimeout(t); }, [toastMsg]);

  const openModal = useCallback((m: ModalName, data: Record<string, string> = {}) => { setModalData(data); setModal(m); }, []);
  const closeModal = useCallback(() => { setModal(null); pending.current = null; afterTg.current = null; }, []);

  const need = useCallback((level: "login" | "pro", fn: () => void) => {
    const cur = sRef.current;
    if (!cur.logged) { pending.current = { level, fn }; setModal("login"); return; }
    if (level === "pro" && !cur.pro) { pending.current = { level, fn }; setModal("pro"); return; }
    fn();
  }, []);
  const resume = useCallback(() => {
    const p = pending.current; pending.current = null; setModal(null);
    if (p) setTimeout(() => need(p.level, p.fn), 30);
  }, [need]);

  const toggleWish = useCallback((id: string) => need("login", () => {
    const on = !sRef.current.wish.includes(id);
    set((st) => ({ wish: on ? [...st.wish, id] : st.wish.filter((w) => w !== id) }));
    toast(on ? "Додано у вішліст" : "Прибрано з вішліста", on ? "favorite" : "check");
  }), [need, set, toast]);

  const defSize = useCallback((p: Product) => {
    const sz = sizesFor(p), my = sRef.current.sizes;
    if (sz.length === 1) return sz[0];
    if (p.cat === "shoes" || p.cat === "sneakers") return my.shoes;
    if (p.cat === "jeans") return my.bottom;
    return my.top;
  }, []);
  const inCart = useCallback((id: string) => s.cart.some((c) => c.id === id), [s.cart]);
  const toggleCart = useCallback((id: string, size?: string) => {
    const has = sRef.current.cart.some((c) => c.id === id);
    if (has) { set((st) => ({ cart: st.cart.filter((c) => c.id !== id) })); toast("Прибрано з кошика"); return; }
    set((st) => ({ cart: [...st.cart, { id, size: size || defSize(byId[id]) }] }));
    toast("Додано в кошик", "shopping_bag");
  }, [set, toast, defSize]);

  const track = useCallback((p: Product) => need("pro", () => {
    if (sRef.current.tracked[p.id]) {
      set((st) => { const t = { ...st.tracked }; delete t[p.id]; return { tracked: t }; });
      toast("Більше не стежимо за ціною", "notifications_off"); return;
    }
    const doTrack = () => {
      const target = Math.round((p.price * 0.85) / 100) * 100;
      set((st) => ({ tracked: { ...st.tracked, [p.id]: target } }));
      toast("Напишемо в Telegram, коли ціна буде " + fmt(target), "notifications_active");
    };
    if (!sRef.current.tg) { afterTg.current = doTrack; setModal("tg"); return; }
    doTrack();
  }), [need, set, toast]);

  const connectTg = useCallback(() => {
    set({ tg: true }); setModal(null);
    toast("Telegram підключено", "send");
    const fn = afterTg.current; afterTg.current = null; if (fn) setTimeout(fn, 30);
  }, [set, toast]);

  const value: Ctx = { s, ready, set, modal, modalData, openModal, closeModal, need, resume, toast, toggleWish, inCart, toggleCart, defSize, track, connectTg };
  return (
    <AppCtx.Provider value={value}>
      {children}
      <div className={"toast" + (toastMsg ? " show" : "")} role="status" aria-live="polite">
        <span className="ms">{toastMsg?.icon || "check"}</span><span>{toastMsg?.text}</span>
      </div>
    </AppCtx.Provider>
  );
}

