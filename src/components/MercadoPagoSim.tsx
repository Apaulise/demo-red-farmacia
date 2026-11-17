"use client";

import { Check, CreditCard, Loader2, Lock, Wallet, X } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { ars } from "@/lib/format";

type Method = "mp-tarjeta" | "mp-dinero";

/** Checkout de Mercado Pago SIMULADO: no se conecta con ningún servicio ni cobra nada */
export function MercadoPagoSim({
  amount,
  onApproved,
  onClose,
}: {
  amount: number;
  onApproved: (method: Method) => void;
  onClose: () => void;
}) {
  const [method, setMethod] = useState<Method>("mp-tarjeta");
  const [stage, setStage] = useState<"form" | "processing" | "approved">("form");

  useEffect(() => {
    if (stage === "processing") {
      const t = setTimeout(() => setStage("approved"), 1800);
      return () => clearTimeout(t);
    }
    if (stage === "approved") {
      const t = setTimeout(() => onApproved(method), 1300);
      return () => clearTimeout(t);
    }
  }, [stage, method, onApproved]);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center md:items-center" role="dialog" aria-modal aria-label="Pago con Mercado Pago (simulado)">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => stage === "form" && onClose()} />
      <div className="relative w-full max-w-md animate-fade-up overflow-hidden rounded-t-[28px] bg-[#F5F5F5] shadow-2xl md:rounded-[28px]">
        <div className="flex items-center justify-between bg-mp px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4}>
                <path d="M3 12c2.5-3 5.5-3 9 0s6.5 3 9 0" strokeLinecap="round" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="font-bold">Mercado Pago</p>
              <p className="text-[11px] text-white/80">Checkout de prueba · sin cobro real</p>
            </div>
          </div>
          {stage === "form" && (
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/15" aria-label="Cerrar">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {stage === "form" && (
          <div className="space-y-4 p-5">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-ink-mute">Pagás a {site.name}</p>
              <p className="font-display text-3xl font-extrabold">{ars(amount)}</p>
            </div>
            <div className="space-y-2">
              {[
                { k: "mp-tarjeta" as const, icon: CreditCard, t: "Tarjeta de débito o crédito", d: "Visa terminada en 3704" },
                { k: "mp-dinero" as const, icon: Wallet, t: "Dinero en cuenta", d: "Saldo disponible" },
              ].map(({ k, icon: Icon, t, d }) => (
                <button
                  key={k}
                  onClick={() => setMethod(k)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-white p-3.5 text-left transition ${method === k ? "border-mp" : "border-transparent"}`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-mp/10 text-mp">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1 leading-tight">
                    <span className="block text-sm font-bold">{t}</span>
                    <span className="block text-xs text-ink-mute">{d}</span>
                  </span>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${method === k ? "border-mp bg-mp" : "border-ink/20"}`}>
                    {method === k && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                </button>
              ))}
            </div>
            {method === "mp-tarjeta" && (
              <div className="grid animate-fade-up grid-cols-2 gap-2 rounded-2xl bg-white p-3 text-sm">
                <label className="col-span-2 text-xs text-ink-mute">
                  Número de tarjeta
                  <input readOnly value="4509 9535 6623 3704" className="mt-1 h-10 w-full rounded-lg border border-line px-3 font-mono text-ink outline-none" />
                </label>
                <label className="text-xs text-ink-mute">
                  Vencimiento
                  <input readOnly value="11/30" className="mt-1 h-10 w-full rounded-lg border border-line px-3 font-mono text-ink outline-none" />
                </label>
                <label className="text-xs text-ink-mute">
                  CVV
                  <input readOnly value="123" className="mt-1 h-10 w-full rounded-lg border border-line px-3 font-mono text-ink outline-none" />
                </label>
                <label className="col-span-2 text-xs text-ink-mute">
                  Cuotas
                  <select className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-2 text-ink outline-none">
                    <option>1 cuota de {ars(amount)}</option>
                    <option>3 cuotas sin interés de {ars(Math.round(amount / 3))}</option>
                  </select>
                </label>
              </div>
            )}
            <button
              onClick={() => setStage("processing")}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-mp py-3.5 font-bold text-white shadow-lg shadow-mp/30 transition hover:brightness-110"
            >
              <Lock className="h-4 w-4" /> Pagar {ars(amount)}
            </button>
            <p className="text-center text-[11px] text-ink-mute">Simulación para la demo: no se realiza ningún cobro.</p>
          </div>
        )}

        {stage !== "form" && (
          <div className="grid place-items-center gap-3 px-6 py-14 text-center">
            {stage === "processing" ? (
              <>
                <Loader2 className="h-14 w-14 animate-spin text-mp" />
                <p className="font-bold">Procesando el pago…</p>
                <p className="text-sm text-ink-mute">No cierres esta ventana</p>
              </>
            ) : (
              <>
                <span className="grid h-20 w-20 animate-pop place-items-center rounded-full bg-[#00A650] text-white shadow-xl shadow-[#00A650]/30">
                  <Check className="h-10 w-10" strokeWidth={3} />
                </span>
                <p className="font-display text-2xl font-extrabold">¡Pago aprobado!</p>
                <p className="text-sm text-ink-mute">{ars(amount)} · Operación #{(amount * 7919) % 99999999}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
