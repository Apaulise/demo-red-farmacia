import type { Branch } from "@/config/site";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function dayInRange(day: string, range: string) {
  const [a, b] = range.split("-");
  const ia = DAYS.indexOf(a);
  const ib = DAYS.indexOf(b ?? a);
  const i = DAYS.indexOf(day);
  if (ia <= ib) return i >= ia && i <= ib;
  return i >= ia || i <= ib;
}

/** ¿Está abierta ahora? (usa openingHours estilo schema.org) */
export function isOpenNow(b: Branch, date = new Date()) {
  if (b.open24) return true;
  const day = DAYS[date.getDay()];
  const mins = date.getHours() * 60 + date.getMinutes();
  return b.openingHours.some((spec) => {
    const [days, hours] = spec.split(" ");
    if (!dayInRange(day, days)) return false;
    const [from, to] = hours.split("-").map((h) => {
      const [hh, mm] = h.split(":").map(Number);
      return hh * 60 + mm;
    });
    return mins >= from && mins <= to;
  });
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
