import { useSyncExternalStore } from "react";
import { branches } from "@/config/site";
import type { Order } from "./types";

const DAY = 86400000;

/** Reloj compartido (se actualiza cada 30 s) — evita leer la hora durante el render del servidor */
let tick = 0;
function subscribeNow(cb: () => void) {
  const t = setInterval(cb, 30000);
  return () => clearInterval(t);
}
function nowSnapshot() {
  const v = Math.floor(Date.now() / 30000) * 30000;
  if (v !== tick) tick = v;
  return tick;
}
export function useNow() {
  return useSyncExternalStore(subscribeNow, nowSnapshot, () => 0);
}

export const CHART = { online: "#1F8FE0", reserva: "#FF5A3C" };

const value = (o: Order) => o.onlineTotal + o.reservaTotal;

export function computeMetrics(all: Order[], branch: string, now: number) {
  const orders = branch === "all" ? all : all.filter((o) => o.branch === branch);
  const t = (o: Order) => new Date(o.createdAt).getTime();
  const cur = orders.filter((o) => t(o) > now - 30 * DAY);
  const prev = orders.filter((o) => t(o) <= now - 30 * DAY && t(o) > now - 60 * DAY);
  const valid = (l: Order[]) => l.filter((o) => o.status !== "cancelado");

  const secured = (l: Order[]) => valid(l).filter((o) => o.paid).reduce((a, o) => a + o.onlineTotal, 0);
  const reservas = (l: Order[]) => l.filter((o) => o.reservaTotal > 0).length;
  const delta = (a: number, b: number) => (b ? (a - b) / b : 0);

  const closed = cur.filter((o) => o.status === "retirado" || o.status === "cancelado");
  const pickupRate = closed.length ? closed.filter((o) => o.status === "retirado").length / closed.length : 1;

  const sumCur = valid(cur).reduce((a, o) => a + value(o), 0);

  // 8 semanas
  const weeks = Array.from({ length: 8 }).map((_, i) => {
    const end = now - (7 - i) * 7 * DAY;
    const start = end - 7 * DAY;
    const l = valid(orders.filter((o) => t(o) > start && t(o) <= end));
    return {
      label: new Date(start + DAY).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
      online: l.reduce((a, o) => a + o.onlineTotal, 0),
      reserva: l.reduce((a, o) => a + o.reservaTotal, 0),
      count: l.length,
    };
  });

  const allCur = all.filter((o) => t(o) > now - 30 * DAY);
  const byBranch = branches
    .map((b) => {
      const l = allCur.filter((o) => o.branch === b.slug);
      return { slug: b.slug, name: b.name, count: l.length, total: valid(l).reduce((a, o) => a + value(o), 0) };
    })
    .sort((a, b) => b.count - a.count);

  const channels = (["instagram", "google", "whatsapp", "web"] as const).map((c) => ({
    key: c,
    count: cur.filter((o) => o.channel === c).length,
  }));

  return {
    orders,
    cur,
    secured: secured(cur),
    securedDelta: delta(secured(cur), secured(prev)),
    count: cur.length,
    countDelta: delta(cur.length, prev.length),
    reservas: reservas(cur),
    reservasDelta: delta(reservas(cur), reservas(prev)),
    ticket: valid(cur).length ? sumCur / valid(cur).length : 0,
    pickupRate,
    weeks,
    byBranch,
    channels,
    pending: orders.filter((o) => o.status === "nuevo").length,
    ready: orders.filter((o) => o.status === "preparado").length,
  };
}
