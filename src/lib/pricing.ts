import type { Offer } from "@/data/offers";
import { modeFor, type Product, type PurchaseMode, getProduct } from "@/data/products";

export type PriceInfo = {
  price: number;
  oldPrice?: number;
  offer?: Offer;
  badge?: string;
};

const round10 = (n: number) => Math.round(n / 10) * 10;

export function offersFor(product: Product, offers: Offer[]) {
  return offers.filter((o) => {
    if (!o.active) return false;
    if (o.target.type === "categoria") return o.target.value === product.category;
    return o.target.value.includes(product.id);
  });
}

export function offerBadge(o: Offer) {
  return o.kind === "porcentaje" ? `${o.value}% OFF` : `2da al ${o.value}%`;
}

export function priceFor(product: Product, offers: Offer[]): PriceInfo {
  const list = offersFor(product, offers);
  const pct = list
    .filter((o) => o.kind === "porcentaje")
    .sort((a, b) => b.value - a.value)[0];
  if (pct) {
    return {
      price: round10(product.price * (1 - pct.value / 100)),
      oldPrice: product.price,
      offer: pct,
      badge: offerBadge(pct),
    };
  }
  const second = list.find((o) => o.kind === "segunda");
  if (second) return { price: product.price, offer: second, badge: offerBadge(second) };
  return { price: product.price };
}

export type CartItem = { id: string; qty: number };

export type CartLine = {
  product: Product;
  qty: number;
  unit: number;
  oldUnit?: number;
  total: number;
  saving: number;
  badge?: string;
  mode: PurchaseMode;
};

export function lineFor(item: CartItem, offers: Offer[]): CartLine | null {
  const product = getProduct(item.id);
  if (!product) return null;
  const info = priceFor(product, offers);
  let total = info.price * item.qty;
  let saving = info.oldPrice ? (info.oldPrice - info.price) * item.qty : 0;
  if (info.offer?.kind === "segunda") {
    const pairs = Math.floor(item.qty / 2);
    const discount = round10(pairs * info.price * (info.offer.value / 100));
    total -= discount;
    saving += discount;
  }
  return {
    product,
    qty: item.qty,
    unit: info.price,
    oldUnit: info.oldPrice,
    total,
    saving,
    badge: info.badge,
    mode: modeFor(product.category),
  };
}

export function summarize(items: CartItem[], offers: Offer[]) {
  const lines = items.map((i) => lineFor(i, offers)).filter(Boolean) as CartLine[];
  const online = lines.filter((l) => l.mode === "online");
  const reserva = lines.filter((l) => l.mode === "reserva");
  const sum = (ls: CartLine[]) => ls.reduce((a, l) => a + l.total, 0);
  return {
    lines,
    online,
    reserva,
    onlineTotal: sum(online),
    reservaTotal: sum(reserva),
    total: sum(lines),
    saving: lines.reduce((a, l) => a + l.saving, 0),
    count: lines.reduce((a, l) => a + l.qty, 0),
  };
}
