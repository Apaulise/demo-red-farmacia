"use client";

import { useSyncExternalStore } from "react";
import { seedOffers, type Offer } from "@/data/offers";
import type { CartItem } from "./pricing";
import { seedOrders, seedPrescriptions, seedStats } from "./seed";
import type { Order, OrderStatus, Prescription, Stats } from "./types";

/**
 * Persistencia simple en localStorage, sincronizada entre pestañas
 * (si tenés la tienda y el panel abiertos a la vez, el pedido aparece solo).
 */

const PREFIX = "rf:v1:";

type Schema = {
  cart: CartItem[];
  branch: string | null;
  orders: Order[];
  rx: Prescription[];
  offers: Offer[];
  stats: Stats;
};
type Key = keyof Schema;

const EMPTY_STATS: Stats = { views: {}, waClicks: 0, waByBranch: {} };

/** Valores que se usan en el servidor y en la primera hidratación (deben ser estables) */
const SERVER: Schema = {
  cart: [],
  branch: null,
  orders: [],
  rx: [],
  offers: seedOffers,
  stats: EMPTY_STATS,
};

function seedFor<K extends Key>(key: K): Schema[K] {
  switch (key) {
    case "orders":
      return seedOrders() as Schema[K];
    case "rx":
      return seedPrescriptions() as Schema[K];
    case "stats":
      return seedStats() as Schema[K];
    default:
      return SERVER[key];
  }
}

const cache = new Map<Key, unknown>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function read<K extends Key>(key: K): Schema[K] {
  if (cache.has(key)) return cache.get(key) as Schema[K];
  let value: Schema[K] | undefined;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw) value = JSON.parse(raw);
  } catch {
    /* almacenamiento bloqueado: seguimos en memoria */
  }
  if (value === undefined) {
    value = seedFor(key);
    if (key === "orders" || key === "rx" || key === "stats") persist(key, value);
  }
  cache.set(key, value);
  return value;
}

function persist<K extends Key>(key: K, value: Schema[K]) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* sin espacio o bloqueado */
  }
}

export function write<K extends Key>(key: K, value: Schema[K]) {
  cache.set(key, value);
  persist(key, value);
  emit();
}

export function update<K extends Key>(key: K, fn: (prev: Schema[K]) => Schema[K]) {
  write(key, fn(read(key)));
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (!e.key) {
      cache.clear();
    } else if (e.key.startsWith(PREFIX)) {
      cache.delete(e.key.slice(PREFIX.length) as Key);
    } else return;
    cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStore<K extends Key>(key: K): Schema[K] {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => SERVER[key],
  );
}

const noop = () => () => {};
/** true después de hidratar (para evitar parpadeos en datos locales) */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

// ───────── Acciones ─────────

export const cart = {
  add(id: string, qty = 1) {
    update("cart", (c) => {
      const found = c.find((i) => i.id === id);
      if (found) return c.map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + qty, 20) } : i));
      return [...c, { id, qty }];
    });
  },
  set(id: string, qty: number) {
    update("cart", (c) =>
      qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 20) } : i)),
    );
  },
  remove(id: string) {
    update("cart", (c) => c.filter((i) => i.id !== id));
  },
  clear() {
    write("cart", []);
  },
};

export function setBranch(slug: string | null) {
  write("branch", slug);
}

export function addOrder(order: Order) {
  update("orders", (o) => [order, ...o]);
}

export function setOrderStatus(code: string, status: OrderStatus) {
  update("orders", (o) =>
    o.map((x) => (x.code === code ? { ...x, status, updatedAt: new Date().toISOString() } : x)),
  );
}

export function addPrescription(rx: Prescription) {
  update("rx", (r) => [rx, ...r]);
}

export function setRxStatus(id: string, status: Prescription["status"]) {
  update("rx", (r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
}

export function saveOffer(offer: Offer) {
  update("offers", (list) => {
    const exists = list.some((o) => o.id === offer.id);
    return exists ? list.map((o) => (o.id === offer.id ? offer : o)) : [offer, ...list];
  });
}

export function deleteOffer(id: string) {
  update("offers", (list) => list.filter((o) => o.id !== id));
}

export function trackView(productId: string) {
  update("stats", (s) => ({ ...s, views: { ...s.views, [productId]: (s.views[productId] ?? 0) + 1 } }));
}

export function trackWhatsApp(branch: string) {
  update("stats", (s) => ({
    ...s,
    waClicks: s.waClicks + 1,
    waByBranch: { ...s.waByBranch, [branch]: (s.waByBranch[branch] ?? 0) + 1 },
  }));
}

/** Vuelve la demo a cero (datos de ejemplo frescos) */
export function resetDemo() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* noop */
  }
  cache.clear();
  emit();
}
