import { branches } from "@/config/site";
import { modeFor, products } from "@/data/products";
import type { Order, OrderStatus, Prescription, Stats } from "./types";

/** PRNG determinístico para que los datos de ejemplo sean siempre iguales */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = [
  "Marcela", "Lucía", "Sofía", "Julieta", "Valentina", "Carla", "Romina", "Florencia",
  "Gabriela", "Natalia", "Paula", "Silvina", "Mariana", "Agustina", "Camila", "Belén",
  "Martín", "Javier", "Diego", "Pablo", "Gonzalo", "Matías", "Lucas", "Federico",
  "Sergio", "Hernán", "Facundo", "Nicolás", "Claudia", "Mónica", "Andrea", "Verónica",
];
const LAST = "ABCDEFGHILMNOPRSTV".split("");

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function makeCode(rand: () => number = Math.random) {
  let s = "";
  for (let i = 0; i < 5; i++) s += CODE_CHARS[Math.floor(rand() * CODE_CHARS.length)];
  return `RF-${s}`;
}

const branchWeights: Record<string, number> = {
  centro: 1.6,
  "plaza-mitre": 1.35,
  ranelagh: 1.0,
  hudson: 0.8,
  platanos: 0.9,
  sourigues: 0.75,
  "villa-espana": 1.1,
  gutierrez: 0.6,
};

function pickWeighted<T>(items: T[], weight: (t: T) => number, rand: () => number) {
  const total = items.reduce((a, t) => a + weight(t), 0);
  let r = rand() * total;
  for (const t of items) {
    r -= weight(t);
    if (r <= 0) return t;
  }
  return items[items.length - 1];
}

export function seedOrders(now = Date.now()): Order[] {
  const rand = mulberry32(20261117);
  const orders: Order[] = [];
  const DAYS = 56;
  const dayMs = 86400000;
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  for (let d = DAYS - 1; d >= 0; d--) {
    const dayStart = startOfToday.getTime() - d * dayMs;
    const weekday = new Date(dayStart).getDay();
    // crecimiento semana a semana (la red adopta el canal online)
    const growth = 0.45 + ((DAYS - d) / DAYS) * 0.85;
    const weekdayFactor = weekday === 0 ? 0.45 : weekday === 6 ? 0.85 : 1;
    const count = Math.round((9 + rand() * 6) * growth * weekdayFactor);

    for (let i = 0; i < count; i++) {
      const hour = 8 + Math.floor(rand() * 13);
      const minute = Math.floor(rand() * 60);
      const createdAt = dayStart + hour * 3600000 + minute * 60000;
      if (createdAt > now) continue;
      const branch = pickWeighted(branches, (b) => branchWeights[b.slug] ?? 1, rand);

      const nItems = 1 + Math.floor(rand() * rand() * 4);
      const chosen = new Map<string, number>();
      for (let k = 0; k < nItems; k++) {
        const p = pickWeighted(products, (x) => x.popularity ** 2, rand);
        chosen.set(p.id, (chosen.get(p.id) ?? 0) + (rand() < 0.2 ? 2 : 1));
      }
      const items = [...chosen.entries()].map(([id, qty]) => {
        const p = products.find((x) => x.id === id)!;
        return {
          id,
          name: p.name,
          qty,
          unit: p.price,
          total: p.price * qty,
          mode: modeFor(p.category),
        };
      });
      const onlineTotal = items.filter((x) => x.mode === "online").reduce((a, x) => a + x.total, 0);
      const reservaTotal = items.filter((x) => x.mode === "reserva").reduce((a, x) => a + x.total, 0);

      const ageH = (now - createdAt) / 3600000;
      let status: OrderStatus;
      if (ageH < 3) status = "nuevo";
      else if (ageH < 20) status = rand() < 0.55 ? "preparado" : "retirado";
      else status = rand() < (onlineTotal > 0 ? 0.015 : 0.08) ? "cancelado" : "retirado";

      const chRand = rand();
      orders.push({
        code: makeCode(rand),
        createdAt: new Date(createdAt).toISOString(),
        branch: branch.slug,
        customer: {
          name: `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}.`,
          phone: `11 5${Math.floor(100 + rand() * 899)}-${Math.floor(1000 + rand() * 8999)}`,
        },
        items,
        onlineTotal,
        reservaTotal,
        paid: onlineTotal > 0,
        paymentMethod: onlineTotal > 0 ? (rand() < 0.7 ? "mp-tarjeta" : "mp-dinero") : null,
        status,
        channel: chRand < 0.46 ? "instagram" : chRand < 0.72 ? "google" : chRand < 0.9 ? "whatsapp" : "web",
      });
    }
  }
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function seedPrescriptions(now = Date.now()): Prescription[] {
  const rows: [number, string, string, string, string, Prescription["status"]][] = [
    [0.4, "centro", "Gabriela M.", "11 5482-1190", "¿Tienen el genérico? Es para mi mamá.", "pendiente"],
    [1.6, "plaza-mitre", "Hernán R.", "11 5631-7754", "Necesito saber precio con PAMI.", "pendiente"],
    [5.2, "ranelagh", "Lucía F.", "11 5320-4418", "Receta del pediatra, ¿la tienen hoy?", "respondida"],
    [9.8, "villa-espana", "Martín S.", "11 5718-2203", "Consulta por disponibilidad.", "respondida"],
    [26, "hudson", "Claudia P.", "11 5904-6631", "", "respondida"],
    [31, "centro", "Federico A.", "11 5245-9087", "¿Cuánto sale con obra social?", "respondida"],
  ];
  return rows.map(([hoursAgo, branch, name, phone, note, status], i) => ({
    id: `rx-seed-${i + 1}`,
    createdAt: new Date(now - hoursAgo * 3600000).toISOString(),
    branch,
    name,
    phone,
    note,
    image: `sample:${(i % 3) + 1}`,
    status,
  }));
}

export function seedStats(): Stats {
  const rand = mulberry32(7);
  const views: Record<string, number> = {};
  for (const p of products) views[p.id] = Math.round(p.popularity * (38 + rand() * 30));
  const waByBranch: Record<string, number> = {};
  for (const b of branches) waByBranch[b.slug] = Math.round(140 * (branchWeights[b.slug] ?? 1) + rand() * 40);
  return { views, waClicks: Object.values(waByBranch).reduce((a, n) => a + n, 0), waByBranch };
}
