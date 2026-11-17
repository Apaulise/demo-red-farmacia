"use client";

import { Check, Clock, FileText, MapPin, Phone, X } from "lucide-react";
import { useState } from "react";
import { getBranch, site } from "@/config/site";
import { timeAgo, toWaNumber, waLink } from "@/lib/format";
import { useNow } from "@/lib/metrics";
import { setRxStatus, useHydrated, useStore } from "@/lib/store";
import type { Prescription } from "@/lib/types";
import { WhatsAppIcon } from "../icons";
import { RxImage } from "../RxImage";
import { useAdminBranch } from "./AdminShell";

function reply(rx: Prescription) {
  const b = getBranch(rx.branch)!;
  const first = rx.name.split(" ")[0];
  return `¡Hola ${first}! Te escribimos de ${site.name} ${b.name} por tu consulta de receta ${rx.id.startsWith("RX-") ? rx.id : ""}. 💊\nTenemos la medicación disponible. Te la separamos hasta el cierre de hoy.\n📍 ${b.address} · ${b.hours}\nRecordá traer la receta original y tu credencial. ¡Te esperamos!`;
}

export function RxAdmin() {
  const hydrated = useHydrated();
  const now = useNow();
  const { branch } = useAdminBranch();
  const all = useStore("rx");
  const [zoom, setZoom] = useState<Prescription | null>(null);
  const [filter, setFilter] = useState<"pendiente" | "respondida" | "todas">("pendiente");

  if (!hydrated || !now) return <div className="h-[60vh]" />;
  const scoped = all.filter((r) => branch === "all" || r.branch === branch);
  const list = scoped.filter((r) => filter === "todas" || r.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["pendiente", "respondida", "todas"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${filter === f ? "bg-ink text-white" : "bg-white text-ink-soft"}`}
            >
              {f === "pendiente" ? "Por responder" : f === "respondida" ? "Respondidas" : "Todas"}
              <span className="ml-1.5 tabular-nums opacity-70">{f === "todas" ? scoped.length : scoped.filter((r) => r.status === f).length}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-mute">Las recetas son consultas: la dispensa se hace en el mostrador con la receta original.</p>
      </div>

      {list.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-line bg-white py-16 text-center">
          <FileText className="h-10 w-10 text-brand-300" />
          <p className="mt-2 font-bold">Todo respondido 🙌</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((r) => {
            const b = getBranch(r.branch);
            return (
              <article key={r.id} className={`flex animate-fade-up gap-4 rounded-3xl border bg-white p-4 ${r.live ? "border-accent/50 ring-4 ring-accent/10" : "border-line"}`}>
                <button onClick={() => setZoom(r)} className="w-24 shrink-0 overflow-hidden rounded-2xl border border-line" aria-label="Ver receta">
                  <RxImage src={r.image} className="aspect-[3/4] h-full w-full" />
                </button>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold">{r.name}</p>
                    {r.status === "pendiente" ? (
                      <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10.5px] font-bold text-accent-600">Pendiente</span>
                    ) : (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10.5px] font-bold text-brand-700">Respondida</span>
                    )}
                  </div>
                  <p className="flex items-center gap-1 text-xs text-ink-mute"><MapPin className="h-3 w-3" /> {b?.name}</p>
                  <p className="flex items-center gap-1 text-xs text-ink-mute"><Clock className="h-3 w-3" /> {timeAgo(r.createdAt, now)} · <Phone className="h-3 w-3" /> {r.phone}</p>
                  {r.note && <p className="mt-1.5 line-clamp-2 rounded-xl bg-surface px-2.5 py-1.5 text-xs text-ink-soft">“{r.note}”</p>}
                  <div className="mt-auto flex gap-2 pt-3">
                    <a
                      href={waLink(toWaNumber(r.phone), reply(r))}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setRxStatus(r.id, "respondida")}
                      className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-wa text-xs font-bold text-white"
                    >
                      <WhatsAppIcon className="h-4 w-4" /> Responder
                    </a>
                    {r.status === "pendiente" && (
                      <button onClick={() => setRxStatus(r.id, "respondida")} className="grid h-9 w-9 place-items-center rounded-full bg-surface" aria-label="Marcar respondida">
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {zoom && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/70 p-4 backdrop-blur" onClick={() => setZoom(null)}>
          <div className="relative w-full max-w-sm animate-pop overflow-hidden rounded-3xl bg-white">
            <RxImage src={zoom.image} className="aspect-[3/4] w-full" />
            <button className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90" aria-label="Cerrar">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
