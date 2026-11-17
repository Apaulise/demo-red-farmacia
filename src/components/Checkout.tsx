"use client";

import { ArrowLeft, CalendarCheck, Check, Info, Loader2, Lock, MapPin, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { getBranch } from "@/config/site";
import { ars } from "@/lib/format";
import { buildOrder } from "@/lib/orders";
import { summarize } from "@/lib/pricing";
import { addOrder, cart, read, setBranch, useHydrated, useStore } from "@/lib/store";
import type { Order } from "@/lib/types";
import { BranchList } from "./BranchList";
import { MPBadge } from "./icons";
import { MercadoPagoSim } from "./MercadoPagoSim";
import { ProductArt } from "./ProductArt";

function Step({ n, title, done, children }: { n: number; title: string; done?: boolean; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-white p-5">
      <h2 className="mb-4 flex items-center gap-3 font-display text-xl font-extrabold">
        <span className={`grid h-8 w-8 place-items-center rounded-full text-sm ${done ? "bg-brand text-white" : "bg-surface text-ink"}`}>
          {done ? <Check className="h-4 w-4" /> : n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Checkout() {
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useStore("cart");
  const offers = useStore("offers");
  const branchSlug = useStore("branch");
  const branch = getBranch(branchSlug);
  const s = summarize(items, offers);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [accept, setAccept] = useState(true);
  const [changing, setChanging] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [placing, setPlacing] = useState(false);

  const validName = name.trim().length >= 2;
  const validPhone = phone.replace(/\D/g, "").length >= 8;
  const ready = !!branch && validName && validPhone && accept;

  const finish = useCallback(
    (method: Order["paymentMethod"]) => {
      const fresh = summarize(read("cart"), read("offers"));
      const order = buildOrder({
        lines: fresh.lines,
        branch: read("branch")!,
        name,
        phone,
        paymentMethod: method,
        existingCodes: new Set(read("orders").map((o) => o.code)),
      });
      setPlacing(true);
      addOrder(order);
      cart.clear();
      router.push(`/confirmacion?codigo=${order.code}`);
    },
    [name, phone, router],
  );

  const submit = () => {
    setTouched(true);
    if (!ready) return;
    if (s.onlineTotal > 0) setPayOpen(true);
    else finish(null);
  };

  if (!hydrated) return <div className="mx-auto h-[70vh] max-w-5xl" />;

  if (placing) {
    return (
      <div className="grid h-[60vh] place-items-center text-center">
        <div>
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand" />
          <p className="mt-3 font-bold">Generando tu código de retiro…</p>
        </div>
      </div>
    );
  }

  if (!s.lines.length) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-extrabold">No hay productos para pagar</h1>
        <Link href="/productos" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 font-bold text-white">Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <Link href="/carrito" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> Volver al carrito
      </Link>
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">Finalizá tu compra</h1>
      <p className="mt-1 text-sm text-ink-soft">Solo retiro en sucursal · confirmación por WhatsApp</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Step n={1} title="¿Dónde retirás?" done={!!branch && !changing}>
            {branch && !changing ? (
              <div className="flex items-center gap-3 rounded-2xl bg-brand-50 p-4">
                <MapPin className="h-5 w-5 text-brand" />
                <div className="flex-1 text-sm leading-tight">
                  <p className="font-bold">{branch.name}</p>
                  <p className="text-ink-soft">{branch.address} · {branch.hours}</p>
                </div>
                <button onClick={() => setChanging(true)} className="text-sm font-bold text-brand">Cambiar</button>
              </div>
            ) : (
              <BranchList
                selected={branchSlug}
                onSelect={(slug) => {
                  setBranch(slug);
                  setChanging(false);
                }}
              />
            )}
            {touched && !branch && <p className="mt-2 text-sm font-semibold text-accent">Elegí una sucursal para continuar.</p>}
          </Step>

          <Step n={2} title="Tus datos" done={validName && validPhone}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Nombre y apellido
                <span className="relative mt-1 block">
                  <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Lucía Fernández"
                    autoComplete="name"
                    className={`h-12 w-full rounded-2xl border bg-surface pl-10 pr-3 font-normal outline-none focus:border-brand focus:bg-white ${touched && !validName ? "border-accent" : "border-line"}`}
                  />
                </span>
              </label>
              <label className="text-sm font-semibold">
                Celular (WhatsApp)
                <span className="relative mt-1 block">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="11 5555-5555"
                    inputMode="tel"
                    autoComplete="tel"
                    className={`h-12 w-full rounded-2xl border bg-surface pl-10 pr-3 font-normal outline-none focus:border-brand focus:bg-white ${touched && !validPhone ? "border-accent" : "border-line"}`}
                  />
                </span>
              </label>
            </div>
            <p className="mt-2 text-xs text-ink-mute">Te avisamos por WhatsApp cuando tu pedido esté listo para retirar.</p>
          </Step>

          <Step n={3} title={s.onlineTotal > 0 ? "Pago" : "Confirmación"}>
            <div className="space-y-3">
              {s.onlineTotal > 0 && (
                <div className="flex items-center gap-3 rounded-2xl border-2 border-mp bg-mp/5 p-4">
                  <Lock className="h-5 w-5 text-mp" />
                  <div className="flex-1 text-sm leading-tight">
                    <p className="flex flex-wrap items-center gap-2 font-bold">
                      Pagás ahora {ars(s.onlineTotal)} <MPBadge />
                    </p>
                    <p className="text-ink-soft">Tarjeta de débito, crédito o dinero en cuenta. Tu compra queda asegurada.</p>
                  </div>
                </div>
              )}
              {s.reservaTotal > 0 && (
                <div className="flex items-center gap-3 rounded-2xl border-2 border-accent/40 bg-accent-50 p-4">
                  <CalendarCheck className="h-5 w-5 text-accent" />
                  <div className="flex-1 text-sm leading-tight">
                    <p className="font-bold">Reserva: pagás {ars(s.reservaTotal)} al retirar</p>
                    <p className="text-ink-soft">Los medicamentos de venta libre se abonan y dispensan en la farmacia.</p>
                  </div>
                </div>
              )}
              <label className="flex cursor-pointer items-start gap-2 text-sm text-ink-soft">
                <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--brand)]" />
                Entiendo que los productos están sujetos a disponibilidad en la sucursal y que el retiro es presencial.
              </label>
            </div>
          </Step>
        </div>

        <aside className="lg:sticky lg:top-40 lg:self-start">
          <div className="space-y-4 rounded-3xl bg-surface p-5">
            <h2 className="font-display text-lg font-extrabold">Resumen</h2>
            <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {s.lines.map((l) => (
                <li key={l.product.id} className="flex items-center gap-3">
                  <span className="relative w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                    <ProductArt product={l.product} className="aspect-square w-full" />
                    <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-bl-lg bg-ink px-1 text-[10px] font-bold text-white">{l.qty}</span>
                  </span>
                  <span className="line-clamp-2 flex-1 text-xs font-semibold">{l.product.name}</span>
                  <span className="text-sm font-bold">{ars(l.total)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 border-t border-line pt-3 text-sm">
              {s.onlineTotal > 0 && (
                <div className="flex justify-between"><span className="text-ink-soft">Pagás ahora</span><b>{ars(s.onlineTotal)}</b></div>
              )}
              {s.reservaTotal > 0 && (
                <div className="flex justify-between"><span className="text-ink-soft">Pagás al retirar</span><b>{ars(s.reservaTotal)}</b></div>
              )}
              {s.saving > 0 && (
                <div className="flex justify-between text-accent-600"><span>Ahorro</span><b>−{ars(s.saving)}</b></div>
              )}
            </div>
            <button
              onClick={submit}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold text-white shadow-lg transition ${
                s.onlineTotal > 0 ? "bg-mp shadow-mp/30 hover:brightness-110" : "bg-brand shadow-brand/25 hover:bg-brand-700"
              } ${ready ? "" : "opacity-60"}`}
            >
              {s.onlineTotal > 0 ? (
                <>
                  <Lock className="h-4 w-4" /> Pagar {ars(s.onlineTotal)} con Mercado Pago
                </>
              ) : (
                <>
                  <CalendarCheck className="h-4 w-4" /> Confirmar reserva
                </>
              )}
            </button>
            {touched && !ready && <p className="text-center text-xs font-semibold text-accent">Completá sucursal, nombre y celular.</p>}
            <p className="flex items-start gap-1.5 text-[11px] text-ink-mute">
              <Info className="mt-px h-3.5 w-3.5 shrink-0" /> Productos sujetos a disponibilidad. Pago simulado para la demo.
            </p>
          </div>
        </aside>
      </div>

      {payOpen && <MercadoPagoSim amount={s.onlineTotal} onClose={() => setPayOpen(false)} onApproved={finish} />}
    </div>
  );
}
