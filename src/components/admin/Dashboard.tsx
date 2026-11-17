"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, CalendarCheck, Clock, CreditCard, MousePointerClick, Package, Receipt } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getBranch } from "@/config/site";
import { getProduct } from "@/data/products";
import { ars, compact, timeAgo } from "@/lib/format";
import { CHART, computeMetrics, useNow } from "@/lib/metrics";
import { orderKind } from "@/lib/orders";
import { useHydrated, useStore } from "@/lib/store";
import { InstagramIcon, WhatsAppIcon } from "../icons";
import { ProductArt } from "../ProductArt";
import { useAdminBranch } from "./AdminShell";
import { KindChip, StatusPill } from "./bits";

function Delta({ v }: { v: number }) {
  if (!isFinite(v) || v === 0) return null;
  const up = v > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${up ? "bg-brand-100 text-brand-700" : "bg-accent-100 text-accent-600"}`}>
      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(v * 100).toFixed(0)}%
    </span>
  );
}

function Kpi({ icon: Icon, label, value, delta, hint, tone = "brand" }: { icon: React.ElementType; label: string; value: string; delta?: number; hint: string; tone?: "brand" | "mp" | "accent" | "wa" }) {
  const tones = { brand: "bg-brand-100 text-brand", mp: "bg-mp/10 text-mp", accent: "bg-accent-100 text-accent", wa: "bg-wa/15 text-[#128C7E]" };
  return (
    <div className="animate-fade-up rounded-3xl border border-line bg-white p-4 md:p-5">
      <div className="flex items-center justify-between">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
        {delta !== undefined && <Delta v={delta} />}
      </div>
      <p className="mt-3 text-xs font-semibold text-ink-mute">{label}</p>
      <p className="whitespace-nowrap font-display text-xl font-extrabold tabular-nums xl:text-2xl 2xl:text-[28px]">{value}</p>
      <p className="text-[11px] text-ink-mute">{hint}</p>
    </div>
  );
}

function WeeklyChart({ weeks }: { weeks: { label: string; online: number; reserva: number; count: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...weeks.map((w) => w.online + w.reserva), 1);
  const nice = Math.ceil(max / 500000) * 500000;
  const ticks = [nice, nice / 2, 0];
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-ink-soft">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: CHART.online }} /> Pagado online (Mercado Pago)</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: CHART.reserva }} /> Reservas (pago en el local)</span>
      </div>
      <div className="relative h-56 pl-12">
        {ticks.map((t, i) => (
          <div key={t} className="absolute left-0 right-0 flex items-center gap-2" style={{ top: `${(i / 2) * 100}%` }}>
            <span className="w-10 -translate-y-1/2 text-right text-[10px] tabular-nums text-ink-mute">{compact(t)}</span>
            <span className="h-px flex-1 -translate-y-1/2 bg-line" />
          </div>
        ))}
        <div className="relative flex h-full items-end gap-2 md:gap-4">
          {weeks.map((w, i) => {
            const hOn = (w.online / nice) * 100;
            const hRes = (w.reserva / nice) * 100;
            const last = i === weeks.length - 1;
            return (
              <div
                key={w.label}
                className="group relative flex h-full flex-1 cursor-default flex-col justify-end"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div className={`mx-auto flex w-full max-w-11 flex-col justify-end gap-[2px] transition-opacity ${hover !== null && hover !== i ? "opacity-45" : ""}`} style={{ height: "100%" }}>
                  {last && <span className="mb-1 whitespace-nowrap text-center text-[11px] font-bold tabular-nums">{compact(w.online + w.reserva)}</span>}
                  <div className="rounded-t-[4px] transition-[height] duration-700" style={{ height: `${hRes}%`, background: CHART.reserva }} />
                  <div className="transition-[height] duration-700" style={{ height: `${hOn}%`, background: CHART.online }} />
                </div>
                {hover === i && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-6 w-48 -translate-x-1/2 rounded-xl bg-ink p-3 text-xs text-white shadow-xl">
                    <p className="mb-1 font-bold">Semana del {w.label}</p>
                    <p className="flex justify-between"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: CHART.online }} />Online</span><b className="tabular-nums">{ars(w.online)}</b></p>
                    <p className="flex justify-between"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: CHART.reserva }} />Reservas</span><b className="tabular-nums">{ars(w.reserva)}</b></p>
                    <p className="mt-1 flex justify-between border-t border-white/15 pt-1 text-white/70"><span>Pedidos</span><b className="tabular-nums">{w.count}</b></p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex gap-2 pl-12 md:gap-4">
        {weeks.map((w, i) => (
          <span key={w.label} className={`flex-1 text-center text-[10px] tabular-nums ${i === weeks.length - 1 ? "font-bold text-ink" : "text-ink-mute"}`}>
            {i === weeks.length - 1 ? "Esta sem." : w.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function HBar({ label, value, max, display, highlight }: { label: React.ReactNode; value: number; max: number; display: string; highlight?: boolean }) {
  return (
    <div className="group">
      <div className="mb-1 flex items-center justify-between gap-2 text-sm">
        <span className={`truncate ${highlight ? "font-bold" : "font-medium text-ink-soft"}`}>{label}</span>
        <span className="font-bold tabular-nums">{display}</span>
      </div>
      <div className="h-2 rounded-full bg-surface">
        <div className={`h-2 rounded-full transition-[width] duration-700 ${highlight ? "bg-brand" : "bg-brand-300 group-hover:bg-brand"}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

const channelLabel = { instagram: "Instagram", google: "Google (búsqueda/Maps)", whatsapp: "WhatsApp", web: "Directo a la web" };

export function Dashboard() {
  const hydrated = useHydrated();
  const now = useNow();
  const { branch } = useAdminBranch();
  const orders = useStore("orders");
  const stats = useStore("stats");

  if (!hydrated || !now || !orders.length) {
    return <div className="grid h-[60vh] place-items-center text-sm text-ink-mute">Cargando métricas…</div>;
  }

  const m = computeMetrics(orders, branch, now);
  const wa = branch === "all" ? stats.waClicks : (stats.waByBranch[branch] ?? 0);
  const topViewed = Object.entries(stats.views)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id, v]) => ({ p: getProduct(id)!, v }))
    .filter((x) => x.p);
  const maxView = topViewed[0]?.v ?? 1;
  const maxBranch = Math.max(...m.byBranch.map((b) => b.count), 1);
  const maxCh = Math.max(...m.channels.map((c) => c.count), 1);
  const recent = m.orders.slice(0, 6);

  return (
    <div className="space-y-5">
      {/* Operación del día */}
      <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl bg-brand p-5 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <p className="text-xs font-bold uppercase tracking-wider text-white/70">Últimos 30 días · {branch === "all" ? "toda la red" : getBranch(branch)?.name}</p>
          <p className="mt-1 whitespace-nowrap font-display text-4xl font-extrabold tabular-nums 2xl:text-5xl">{ars(m.secured)}</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-white/85">
            en ventas aseguradas online antes de llegar al mostrador <Delta v={m.securedDelta} />
          </p>
        </div>
        <Link href="/admin/pedidos?estado=nuevo" className="card-hover flex items-center gap-4 rounded-3xl border border-line bg-white p-5">
          <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white">
            <Package className="h-6 w-6" />
            {m.pending > 0 && <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-accent ring-2 ring-white" />}
          </span>
          <span className="flex-1">
            <span className="block font-display text-3xl font-extrabold tabular-nums">{m.pending}</span>
            <span className="block text-sm text-ink-soft">pedidos nuevos para preparar</span>
          </span>
          <ArrowRight className="h-5 w-5 text-ink-mute" />
        </Link>
        <Link href="/admin/pedidos?estado=preparado" className="card-hover flex items-center gap-4 rounded-3xl border border-line bg-white p-5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand">
            <BadgeCheck className="h-6 w-6" />
          </span>
          <span className="flex-1">
            <span className="block font-display text-3xl font-extrabold tabular-nums">{m.ready}</span>
            <span className="block text-sm text-ink-soft">listos esperando retiro</span>
          </span>
          <ArrowRight className="h-5 w-5 text-ink-mute" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <Kpi icon={Receipt} label="Pedidos y reservas" value={String(m.count)} delta={m.countDelta} hint="últimos 30 días" />
        <Kpi icon={CalendarCheck} label="Reservas venta libre" value={String(m.reservas)} delta={m.reservasDelta} hint="se cobran en el local" tone="accent" />
        <Kpi icon={CreditCard} label="Ticket promedio" value={ars(Math.round(m.ticket))} hint="online + reservas" tone="mp" />
        <Kpi icon={MousePointerClick} label="Clics a WhatsApp" value={compact(wa)} hint="consultas y confirmaciones" tone="wa" />
        <Kpi icon={BadgeCheck} label="Tasa de retiro" value={`${Math.round(m.pickupRate * 100)}%`} hint="pedidos efectivamente retirados" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-3xl border border-line bg-white p-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-lg font-extrabold">Ventas por semana</h2>
              <p className="text-xs text-ink-mute">Últimas 8 semanas · pesos argentinos</p>
            </div>
            <span className="text-xs font-semibold text-ink-mute">Pasá el mouse por cada semana</span>
          </div>
          <WeeklyChart weeks={m.weeks} />
        </section>
        <section className="rounded-3xl border border-line bg-white p-5">
          <h2 className="font-display text-lg font-extrabold">Pedidos por sucursal</h2>
          <p className="mb-4 text-xs text-ink-mute">Últimos 30 días</p>
          <div className="space-y-3">
            {m.byBranch.map((b) => (
              <HBar key={b.slug} label={b.name} value={b.count} max={maxBranch} display={`${b.count} · ${compact(b.total)}`} highlight={branch === b.slug || branch === "all"} />
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-3xl border border-line bg-white p-5">
          <h2 className="font-display text-lg font-extrabold">Productos más vistos</h2>
          <p className="mb-4 text-xs text-ink-mute">Visitas a la ficha (incluye las de esta demo)</p>
          <ul className="space-y-3">
            {topViewed.map(({ p, v }, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="w-4 text-xs font-bold text-ink-mute">{i + 1}</span>
                <span className="w-10 shrink-0 overflow-hidden rounded-lg border border-line">
                  <ProductArt product={p} className="aspect-square w-full" />
                </span>
                <div className="min-w-0 flex-1">
                  <HBar label={p.name} value={v} max={maxView} display={compact(v)} highlight />
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-line bg-white p-5">
          <h2 className="font-display text-lg font-extrabold">¿De dónde vienen?</h2>
          <p className="mb-4 text-xs text-ink-mute">Canal de origen de los pedidos · 30 días</p>
          <div className="space-y-3">
            {m.channels.map((c) => (
              <HBar
                key={c.key}
                label={
                  <span className="flex items-center gap-2">
                    {c.key === "instagram" ? <InstagramIcon className="h-4 w-4" /> : c.key === "whatsapp" ? <WhatsAppIcon className="h-4 w-4" /> : null}
                    {channelLabel[c.key]}
                  </span>
                }
                value={c.count}
                max={maxCh}
                display={`${Math.round((c.count / Math.max(m.count, 1)) * 100)}%`}
                highlight
              />
            ))}
          </div>
          <p className="mt-4 rounded-2xl bg-surface p-3 text-xs text-ink-soft">
            Las promos de redes + el SEO local por sucursal traen la mayoría de los pedidos online.
          </p>
        </section>
        <section className="rounded-3xl border border-line bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">Últimos movimientos</h2>
            <Link href="/admin/pedidos" className="text-xs font-bold text-brand">Ver todos</Link>
          </div>
          <ul className="divide-y divide-line">
            {recent.map((o) => (
              <li key={o.code}>
                <Link href={`/admin/pedidos?codigo=${o.code}`} className={`flex items-center gap-3 py-2.5 ${o.live ? "animate-fade-up" : ""}`}>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <span className="font-mono">{o.code}</span> <KindChip kind={orderKind(o)} />
                    </span>
                    <span className="flex items-center gap-1 truncate text-xs text-ink-mute">
                      <Clock className="h-3 w-3" /> {timeAgo(o.createdAt, now)} · {getBranch(o.branch)?.name}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm font-bold tabular-nums">{ars(o.onlineTotal + o.reservaTotal)}</span>
                    <StatusPill status={o.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
