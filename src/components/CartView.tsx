"use client";

import { ArrowRight, CalendarCheck, CreditCard, Info, MapPin, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { getBranch } from "@/config/site";
import { ars } from "@/lib/format";
import { summarize, type CartLine } from "@/lib/pricing";
import { cart, useHydrated, useStore } from "@/lib/store";
import { openBranchPicker } from "./BranchPicker";
import { MPBadge } from "./icons";
import { ProductArt } from "./ProductArt";

function Line({ l }: { l: CartLine }) {
  return (
    <li className="flex gap-3 py-3">
      <Link href={`/productos/${l.product.slug}`} className="w-20 shrink-0 overflow-hidden rounded-2xl border border-line md:w-24">
        <ProductArt product={l.product} className="aspect-square w-full" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/productos/${l.product.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-brand">
            {l.product.name}
          </Link>
          <button onClick={() => cart.remove(l.product.id)} className="shrink-0 rounded-full p-1.5 text-ink-mute hover:bg-surface hover:text-accent" aria-label="Quitar">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-ink-mute">
          {l.product.size}
          {l.badge && <span className="ml-2 rounded-full bg-accent-100 px-1.5 py-0.5 font-bold text-accent-600">{l.badge}</span>}
        </p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex h-9 items-center rounded-full border border-line">
            <button className="grid h-9 w-9 place-items-center" onClick={() => cart.set(l.product.id, l.qty - 1)} aria-label="Restar">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold">{l.qty}</span>
            <button className="grid h-9 w-9 place-items-center" onClick={() => cart.set(l.product.id, l.qty + 1)} aria-label="Sumar">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="text-right leading-tight">
            {l.saving > 0 && <p className="text-[11px] font-semibold text-accent-600">Ahorrás {ars(l.saving)}</p>}
            <p className="font-display text-lg font-extrabold">{ars(l.total)}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Group({ mode, lines, total }: { mode: "online" | "reserva"; lines: CartLine[]; total: number }) {
  if (!lines.length) return null;
  const online = mode === "online";
  return (
    <section className={`overflow-hidden rounded-3xl border ${online ? "border-mp/25" : "border-accent/25"}`}>
      <header className={`flex items-center gap-3 px-4 py-3 ${online ? "bg-mp/5" : "bg-accent-50"}`}>
        <span className={`grid h-9 w-9 place-items-center rounded-xl text-white ${online ? "bg-mp" : "bg-accent"}`}>
          {online ? <CreditCard className="h-4.5 w-4.5" /> : <CalendarCheck className="h-4.5 w-4.5" />}
        </span>
        <div className="flex-1 leading-tight">
          <p className="flex flex-wrap items-center gap-2 font-bold">
            {online ? "Pagás online y retirás" : "Reservás y pagás en el local"}
            {online && <MPBadge />}
          </p>
          <p className="text-xs text-ink-soft">
            {online ? "Perfumería, dermo, bebés y cuidado personal" : "Medicamentos de venta libre · se abonan y dispensan en la farmacia"}
          </p>
        </div>
        <p className="font-display text-lg font-extrabold">{ars(total)}</p>
      </header>
      <ul className="divide-y divide-line px-4">
        {lines.map((l) => (
          <Line key={l.product.id} l={l} />
        ))}
      </ul>
    </section>
  );
}

export function CartView() {
  const items = useStore("cart");
  const offers = useStore("offers");
  const branch = getBranch(useStore("branch"));
  const hydrated = useHydrated();
  const s = summarize(items, offers);

  if (!hydrated) return <div className="mx-auto h-[60vh] max-w-5xl" />;

  if (!s.lines.length) {
    return (
      <div className="mx-auto grid max-w-lg place-items-center px-4 py-24 text-center">
        <span className="grid h-20 w-20 animate-pop place-items-center rounded-full bg-brand-100 text-brand">
          <ShoppingBag className="h-9 w-9" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-extrabold">Tu carrito está vacío</h1>
        <p className="mt-2 text-ink-soft">Sumá productos del catálogo y retiralos en tu farmacia.</p>
        <Link href="/productos" className="mt-6 rounded-full bg-brand px-6 py-3 font-bold text-white">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 md:px-6 md:pt-8">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">Tu carrito</h1>
      <p className="mt-1 text-sm text-ink-soft">{s.count} productos · retiro en sucursal</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Group mode="online" lines={s.online} total={s.onlineTotal} />
          <Group mode="reserva" lines={s.reserva} total={s.reservaTotal} />
          <p className="flex items-start gap-2 rounded-2xl bg-surface px-4 py-3 text-xs text-ink-soft">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            Todos los productos están <b className="contents">sujetos a disponibilidad</b> en la sucursal elegida. Si algo faltara, la farmacia
            te contacta por WhatsApp para ofrecerte una alternativa o el reintegro.
          </p>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-40 lg:self-start">
          <button onClick={openBranchPicker} className="flex w-full items-center gap-3 rounded-3xl border border-line p-4 text-left transition hover:border-brand">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="flex-1 leading-tight">
              <span className="block text-xs text-ink-mute">Retirás en</span>
              <span className="block font-bold">{branch ? branch.name : "Elegí tu farmacia"}</span>
              {branch && <span className="block text-xs text-ink-mute">{branch.address}</span>}
            </span>
            <span className="text-xs font-bold text-brand">{branch ? "Cambiar" : "Elegir"}</span>
          </button>

          <div className="space-y-3 rounded-3xl bg-surface p-5">
            {s.onlineTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">Pagás ahora (Mercado Pago)</span>
                <b>{ars(s.onlineTotal)}</b>
              </div>
            )}
            {s.reservaTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">Pagás al retirar (reserva)</span>
                <b>{ars(s.reservaTotal)}</b>
              </div>
            )}
            {s.saving > 0 && (
              <div className="flex justify-between text-sm text-accent-600">
                <span>Ahorro en promos</span>
                <b>−{ars(s.saving)}</b>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft">Envío</span>
              <span className="font-semibold text-brand">Retiro en sucursal · gratis</span>
            </div>
            <div className="flex items-end justify-between border-t border-line pt-3">
              <span className="font-bold">Total</span>
              <span className="font-display text-3xl font-extrabold">{ars(s.total)}</span>
            </div>
            <Link
              href="/checkout"
              className="flex h-13 items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-bold text-white shadow-lg shadow-brand/25 transition hover:gap-3 hover:bg-brand-700"
            >
              {s.onlineTotal > 0 ? "Continuar al pago" : "Continuar con la reserva"} <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-center text-[11px] text-ink-mute">Productos sujetos a disponibilidad.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
