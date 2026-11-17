"use client";

import { CalendarCheck, Check, Clock, Copy, CreditCard, MapPin, Navigation, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { getBranch } from "@/config/site";
import { getProduct } from "@/data/products";
import { ars, branchMapsUrl, waLink } from "@/lib/format";
import { customerWhatsAppMessage, orderKind } from "@/lib/orders";
import { trackWhatsApp, useHydrated, useStore } from "@/lib/store";
import { WhatsAppIcon } from "./icons";
import { ProductArt } from "./ProductArt";
import { toast } from "./Toaster";

const statusCopy = {
  nuevo: { t: "Recibido", d: "La farmacia está preparando tu pedido" },
  preparado: { t: "¡Listo para retirar!", d: "Ya podés pasar por la sucursal" },
  retirado: { t: "Retirado", d: "¡Gracias por tu compra!" },
  cancelado: { t: "Cancelado", d: "Comunicate con la sucursal" },
};

export function Confirmation() {
  const code = useSearchParams().get("codigo") ?? "";
  const orders = useStore("orders");
  const hydrated = useHydrated();
  const order = orders.find((o) => o.code === code);
  const [qr, setQr] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (!code) return;
    const url = `${window.location.origin}/admin/pedidos?codigo=${code}`;
    QRCode.toString(url, { type: "svg", margin: 1, color: { dark: "#0C1F1B", light: "#ffffff" }, errorCorrectionLevel: "M" }).then(setQr);
  }, [code]);

  if (!hydrated) return <div className="h-[70vh]" />;
  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-extrabold">No encontramos ese pedido</h1>
        <Link href="/productos" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 font-bold text-white">Ir al catálogo</Link>
      </div>
    );
  }

  const branch = getBranch(order.branch)!;
  const kind = orderKind(order);
  const first = order.customer.name.split(" ")[0];
  const st = statusCopy[order.status];
  const steps = ["nuevo", "preparado", "retirado"] as const;
  const stepIdx = steps.indexOf(order.status as (typeof steps)[number]);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 md:px-6 md:pt-12">
      <div className="text-center">
        <span className="relative mx-auto grid h-20 w-20 place-items-center">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand/30" />
          <span className="relative grid h-20 w-20 animate-pop place-items-center rounded-full bg-brand text-white shadow-xl shadow-brand/30">
            <Check className="h-10 w-10" strokeWidth={3} />
          </span>
        </span>
        <h1 className="mt-5 animate-fade-up font-display text-3xl font-extrabold md:text-5xl">
          {kind === "reserva" ? `¡Reserva confirmada, ${first}!` : `¡Listo, ${first}! Tu compra está asegurada`}
        </h1>
        <p className="mx-auto mt-2 max-w-xl animate-fade-up text-ink-soft [animation-delay:.1s]">
          Retirala en <b>{branch.name}</b> mostrando tu código o el QR. Confirmá el pedido por WhatsApp y te avisamos cuando esté listo.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-[1fr_1.2fr]">
        {/* Ticket con QR */}
        <div className="animate-fade-up overflow-hidden rounded-[28px] bg-ink text-white shadow-2xl [animation-delay:.15s]">
          <div className="p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Código de retiro</p>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(order.code);
                toast("Código copiado", order.code);
              }}
              className="mt-1 inline-flex items-center gap-2 font-mono text-4xl font-extrabold tracking-wider"
            >
              {order.code} <Copy className="h-5 w-5 text-white/50" />
            </button>
            <div className="mx-auto mt-5 w-48 overflow-hidden rounded-2xl bg-white p-2 md:w-56">
              {qr ? <div className="[&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: qr }} /> : <div className="aspect-square" />}
            </div>
            <p className="mt-3 text-xs text-white/60">La farmacia escanea este QR para entregarte el pedido</p>
          </div>
          <div className="relative border-t-2 border-dashed border-white/15 p-6">
            <span className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-white" />
            <span className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-white" />
            <p className="flex items-center gap-2 font-bold"><MapPin className="h-4 w-4 text-brand-300" /> {branch.name}</p>
            <p className="ml-6 text-sm text-white/70">{branch.address}</p>
            <p className="ml-6 mt-1 flex items-center gap-1.5 text-sm text-white/70"><Clock className="h-3.5 w-3.5" /> {branch.hours}</p>
            <a href={branchMapsUrl(branch)} target="_blank" rel="noreferrer" className="ml-6 mt-2 inline-flex items-center gap-1 text-sm font-bold text-brand-300">
              <Navigation className="h-3.5 w-3.5" /> Cómo llegar
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <a
            href={waLink(branch.whatsapp, customerWhatsAppMessage(order))}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsApp(branch.slug)}
            className="flex animate-fade-up items-center gap-4 rounded-3xl bg-wa p-5 text-white shadow-xl shadow-wa/25 transition hover:-translate-y-0.5 [animation-delay:.2s]"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/20">
              <WhatsAppIcon className="h-7 w-7" />
            </span>
            <span className="flex-1 leading-tight">
              <span className="block text-lg font-extrabold">Confirmar por WhatsApp</span>
              <span className="block text-sm text-white/85">Le mandás el pedido {order.code} a {branch.name}</span>
            </span>
          </a>

          {/* Estado */}
          <div className="rounded-3xl border border-line p-5">
            <div className="flex items-center justify-between">
              <p className="font-bold">{st.t}</p>
              <span className="text-xs text-ink-mute">Se actualiza solo</span>
            </div>
            <p className="text-sm text-ink-soft">{st.d}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["Recibido", "Preparado", "Retirado"].map((l, i) => (
                <div key={l}>
                  <div className={`h-1.5 rounded-full transition-colors duration-700 ${i <= stepIdx ? "bg-brand" : "bg-surface"}`} />
                  <p className={`mt-1.5 text-xs font-semibold ${i <= stepIdx ? "text-brand" : "text-ink-mute"}`}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detalle */}
          <div className="space-y-3 rounded-3xl bg-surface p-5">
            {order.onlineTotal > 0 && (
              <div>
                <p className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-mp" /> Pagado con Mercado Pago</span>
                  <span className="rounded-full bg-[#00A650]/10 px-2 py-0.5 text-xs text-[#00A650]">Aprobado · {ars(order.onlineTotal)}</span>
                </p>
                <Items items={order.items.filter((i) => i.mode === "online")} />
              </div>
            )}
            {order.reservaTotal > 0 && (
              <div className={order.onlineTotal > 0 ? "border-t border-line pt-3" : ""}>
                <p className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span className="flex items-center gap-2"><CalendarCheck className="h-4 w-4 text-accent" /> Reserva · pagás al retirar</span>
                  <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs text-accent-600">{ars(order.reservaTotal)}</span>
                </p>
                <Items items={order.items.filter((i) => i.mode === "reserva")} />
              </div>
            )}
            <p className="text-[11px] text-ink-mute">Productos sujetos a disponibilidad. Si algo faltara, la sucursal te contacta por WhatsApp.</p>
          </div>

          <Link href="/productos" className="flex items-center justify-center gap-2 rounded-full border border-line py-3 text-sm font-bold hover:border-brand hover:text-brand">
            <ShoppingBag className="h-4 w-4" /> Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

function Items({ items }: { items: { id: string; name: string; qty: number; total: number }[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => {
        const p = getProduct(i.id);
        return (
          <li key={i.id} className="flex items-center gap-3">
            {p && (
              <span className="w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                <ProductArt product={p} className="aspect-square w-full" />
              </span>
            )}
            <span className="flex-1 text-xs font-semibold">{i.qty} × {i.name}</span>
            <span className="text-sm font-bold">{ars(i.total)}</span>
          </li>
        );
      })}
    </ul>
  );
}
