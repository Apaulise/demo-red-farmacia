import { site, type Branch } from "@/config/site";

const money = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
  maximumFractionDigits: 0,
});

export const ars = (n: number) => money.format(n).replace(/ /g, " ");

export const compact = (n: number) =>
  new Intl.NumberFormat(site.locale, { notation: "compact", maximumFractionDigits: 1 }).format(n);

export function timeAgo(iso: string, now = Date.now()) {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "recién";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? "ayer" : `hace ${d} días`;
}

export function dateTime(iso: string) {
  return new Date(iso).toLocaleString(site.locale, {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function waLink(phone: string, text: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

/** Normaliza un celular argentino escrito a mano (11 5555-5555) a formato wa.me */
export function toWaNumber(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("54")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.startsWith("9")) d = d.slice(1);
  d = d.replace(/^(\d{2,4})15/, "$1");
  return `549${d}`;
}

export function branchMapsUrl(b: Branch) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.address}, ${b.neighborhood}, Berazategui`)}`;
}
