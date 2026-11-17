"use client";

import { BadgeCheck, CalendarCheck, Clock, CreditCard, PackageCheck, Phone, QrCode, Search, X, XCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getBranch } from "@/config/site";
import { ars, dateTime, timeAgo, toWaNumber, waLink } from "@/lib/format";
import { useNow } from "@/lib/metrics";
import { orderKind, readyWhatsAppMessage } from "@/lib/orders";
import { setOrderStatus, useHydrated, useStore } from "@/lib/store";
import type { Order, OrderStatus } from "@/lib/types";
import { WhatsAppIcon } from "../icons";
import { toast } from "../Toaster";
import { useAdminBranch } from "./AdminShell";
import { KindChip, StatusPill } from "./bits";

const TABS: { key: OrderStatus | "todos"; label: string }[] = [
  { key: "nuevo", label: "Nuevos" },
  { key: "preparado", label: "Preparados" },
  { key: "retirado", label: "Retirados" },
  { key: "todos", label: "Todos" },
];

function Actions({ o, big = false }: { o: Order; big?: boolean }) {
  const h = big ? "h-12 text-sm" : "h-9 text-xs";
  if (o.status === "nuevo")
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOrderStatus(o.code, "preparado");
          toast(`${o.code} marcado como preparado`, "Avisale al cliente por WhatsApp");
        }}
        className={`flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 font-bold text-white transition hover:bg-brand ${h} ${big ? "w-full" : ""}`}
      >
        <PackageCheck className="h-4 w-4" /> Marcar preparado
      </button>
    );
  if (o.status === "preparado")
    return (
      <div className={big ? "grid grid-cols-2 gap-2" : "flex gap-2"}>
        <a
          href={waLink(toWaNumber(o.customer.phone), readyWhatsAppMessage(o))}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`flex items-center justify-center gap-1.5 rounded-full bg-wa px-3 font-bold text-white ${h}`}
          aria-label="Avisar por WhatsApp"
        >
          <WhatsAppIcon className="h-4 w-4" /> {big && "Avisar que está listo"}
        </a>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOrderStatus(o.code, "retirado");
            toast(`${o.code} entregado ✔`, o.reservaTotal > 0 ? `Cobrar ${ars(o.reservaTotal)} en caja` : "Ya estaba pago");
          }}
          className={`flex items-center justify-center gap-1.5 rounded-full bg-brand px-4 font-bold text-white transition hover:bg-brand-700 ${h}`}
        >
          <BadgeCheck className="h-4 w-4" /> Entregar
        </button>
      </div>
    );
  return null;
}

function Detail({ o, onClose, now }: { o: Order; onClose: () => void; now: number }) {
  const b = getBranch(o.branch)!;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center" role="dialog" aria-modal>
      <button className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} aria-label="Cerrar" />
      <div className="relative max-h-[92dvh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl md:rounded-[28px]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Pedido</p>
            <p className="font-mono text-3xl font-extrabold">{o.code}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <StatusPill status={o.status} />
              <KindChip kind={orderKind(o)} />
              {o.live && <span className="rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-bold text-white">Hecho en vivo</span>}
            </div>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-surface" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl bg-surface p-3">
            <p className="text-xs text-ink-mute">Cliente</p>
            <p className="font-bold">{o.customer.name}</p>
            <p className="flex items-center gap-1 text-xs text-ink-soft"><Phone className="h-3 w-3" /> {o.customer.phone}</p>
          </div>
          <div className="rounded-2xl bg-surface p-3">
            <p className="text-xs text-ink-mute">Retira en</p>
            <p className="font-bold">{b.name}</p>
            <p className="flex items-center gap-1 text-xs text-ink-soft"><Clock className="h-3 w-3" /> {dateTime(o.createdAt)} · {timeAgo(o.createdAt, now)}</p>
          </div>
        </div>

        {(["online", "reserva"] as const).map((mode) => {
          const items = o.items.filter((i) => i.mode === mode);
          if (!items.length) return null;
          const online = mode === "online";
          return (
            <div key={mode} className="mt-4">
              <p className="mb-2 flex items-center justify-between text-sm font-bold">
                <span className="flex items-center gap-2">
                  {online ? <CreditCard className="h-4 w-4 text-mp" /> : <CalendarCheck className="h-4 w-4 text-accent" />}
                  {online ? "Pagado con Mercado Pago" : "Reserva · cobrar al entregar"}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${online ? "bg-[#00A650]/10 text-[#00A650]" : "bg-accent-100 text-accent-600"}`}>
                  {ars(online ? o.onlineTotal : o.reservaTotal)}
                </span>
              </p>
              <ul className="divide-y divide-line rounded-2xl border border-line px-3">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3 py-2 text-sm">
                    <span><b>{i.qty}×</b> {i.name}</span>
                    <span className="font-semibold tabular-nums">{ars(i.total)}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <div className="mt-5 space-y-2">
          <Actions o={o} big />
          {o.status !== "cancelado" && o.status !== "retirado" && (
            <button
              onClick={() => {
                setOrderStatus(o.code, "cancelado");
                toast(`${o.code} cancelado`);
              }}
              className="flex w-full items-center justify-center gap-1.5 py-2 text-xs font-semibold text-ink-mute hover:text-accent"
            >
              <XCircle className="h-3.5 w-3.5" /> Cancelar pedido (sin stock)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function OrdersAdmin() {
  const hydrated = useHydrated();
  const now = useNow();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { branch } = useAdminBranch();
  const orders = useStore("orders");
  const [q, setQ] = useState("");

  const tab = (params.get("estado") as OrderStatus | "todos" | null) ?? "nuevo";
  const code = params.get("codigo");
  const setParams = (patch: Record<string, string | null>) => {
    const n = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k)));
    router.replace(`${pathname}?${n.toString()}`, { scroll: false });
  };

  if (!hydrated || !now) return <div className="h-[60vh]" />;

  const scoped = orders.filter((o) => branch === "all" || o.branch === branch);
  const counts = Object.fromEntries(TABS.map((t) => [t.key, t.key === "todos" ? scoped.length : scoped.filter((o) => o.status === t.key).length]));
  const term = q.trim().toLowerCase();
  const list = scoped
    .filter((o) => tab === "todos" || o.status === tab)
    .filter((o) => !term || o.code.toLowerCase().includes(term) || o.customer.name.toLowerCase().includes(term))
    .slice(0, 80);
  const selected = code ? orders.find((o) => o.code.toUpperCase() === code.toUpperCase()) : undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="scroll-x -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setParams({ estado: t.key, codigo: null })}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${tab === t.key ? "bg-ink text-white" : "bg-white text-ink-soft hover:bg-brand-50"}`}
            >
              {t.label}
              <span className={`rounded-full px-1.5 text-[11px] tabular-nums ${tab === t.key ? "bg-white/20" : t.key === "nuevo" && counts[t.key] ? "bg-accent text-white" : "bg-surface"}`}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative md:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const hit = scoped.find((o) => o.code.toLowerCase() === term || o.code.toLowerCase() === `rf-${term}`);
                if (hit) setParams({ codigo: hit.code });
              }
            }}
            placeholder="Buscar código (RF-…) o cliente"
            className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-10 text-sm outline-none focus:border-brand"
          />
          <QrCode className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
        </div>
      </div>

      {list.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-line bg-white py-16 text-center">
          <PackageCheck className="h-10 w-10 text-brand-300" />
          <p className="mt-2 font-bold">No hay pedidos en esta etapa</p>
          <p className="text-sm text-ink-mute">Cuando entre uno nuevo desde la web, aparece acá al instante.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-line bg-white">
          <div className="hidden grid-cols-[130px_1.3fr_1fr_120px_120px_220px] gap-3 border-b border-line bg-surface/60 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-ink-mute lg:grid">
            <span>Código</span>
            <span>Cliente</span>
            <span>Sucursal</span>
            <span className="text-right">Total</span>
            <span>Estado</span>
            <span />
          </div>
          <ul className="divide-y divide-line">
            {list.map((o) => (
              <li
                key={o.code}
                onClick={() => setParams({ codigo: o.code })}
                className={`grid cursor-pointer grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-3 transition hover:bg-brand-50/50 lg:grid-cols-[130px_1.3fr_1fr_120px_120px_220px] lg:px-5 ${o.live ? "animate-fade-up bg-[#FFFBEA]" : ""}`}
              >
                <span className="font-mono text-sm font-extrabold">
                  {o.code}
                  <span className="block font-sans text-[11px] font-medium text-ink-mute">{timeAgo(o.createdAt, now)}</span>
                </span>
                <span className="text-right lg:order-none lg:text-left">
                  <span className="block text-sm font-semibold">{o.customer.name}</span>
                  <KindChip kind={orderKind(o)} />
                </span>
                <span className="text-sm text-ink-soft">{getBranch(o.branch)?.name}</span>
                <span className="text-right text-sm font-bold tabular-nums">
                  {ars(o.onlineTotal + o.reservaTotal)}
                  {o.reservaTotal > 0 && <span className="block text-[11px] font-medium text-accent-600">{ars(o.reservaTotal)} a cobrar</span>}
                </span>
                <span>
                  <StatusPill status={o.status} />
                </span>
                <span className="flex justify-end">
                  <Actions o={o} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selected && <Detail o={selected} now={now} onClose={() => setParams({ codigo: null })} />}
    </div>
  );
}
