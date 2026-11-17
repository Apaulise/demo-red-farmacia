"use client";

import { Crosshair, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { branches, getBranch } from "@/config/site";
import { distanceKm } from "@/lib/branches";
import { setBranch, useStore } from "@/lib/store";
import { BranchList } from "./BranchList";
import { BranchMap } from "./BranchMap";
import { toast } from "./Toaster";

const EVT = "rf-branch-picker";

export function openBranchPicker() {
  window.dispatchEvent(new Event(EVT));
}

/** Centro aproximado de Berazategui: se usa si el navegador no comparte la ubicación */
const FALLBACK = { lat: -34.772, lng: -58.19 };

export function BranchPicker() {
  const [open, setOpen] = useState(false);
  const current = useStore("branch");
  const [distances, setDistances] = useState<Record<string, number> | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (slug: string) => {
    setBranch(slug);
    toast(`Retirás en ${getBranch(slug)?.name}`, "Podés cambiarla cuando quieras");
    setOpen(false);
  };

  const locate = () => {
    setLocating(true);
    const done = (pos: { lat: number; lng: number }) => {
      const d: Record<string, number> = {};
      for (const b of branches) d[b.slug] = distanceKm(pos, b.geo);
      setDistances(d);
      setLocating(false);
    };
    if (!navigator.geolocation) return done(FALLBACK);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const here = { lat: p.coords.latitude, lng: p.coords.longitude };
        // Si estás lejos de Berazategui (ej. grabando la demo), usamos el centro de la ciudad
        done(distanceKm(here, FALLBACK) > 25 ? FALLBACK : here);
      },
      () => done(FALLBACK),
      { timeout: 5000 },
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center" role="dialog" aria-modal aria-label="Elegí tu farmacia">
      <button className="absolute inset-0 animate-[fade-up_.2s_ease] bg-ink/50 backdrop-blur-sm" aria-label="Cerrar" onClick={() => setOpen(false)} />
      <div className="relative flex max-h-[92dvh] w-full animate-fade-up flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl md:max-w-4xl md:rounded-[28px]">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 pb-4 pt-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand">Retiro en sucursal</p>
            <h2 className="font-display text-2xl font-extrabold">Elegí tu farmacia</h2>
            <p className="text-sm text-ink-soft">Tus compras y reservas te esperan en la sucursal que elijas.</p>
          </div>
          <button onClick={() => setOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface hover:bg-brand-100" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-5 md:grid-cols-[1.1fr_1fr]">
          <div className="space-y-3">
            <BranchMap selected={current} onSelect={choose} />
            <button
              onClick={locate}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-100"
            >
              {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
              {distances ? "Ordenadas por cercanía" : "Usar mi ubicación"}
            </button>
          </div>
          <BranchList selected={current} onSelect={choose} distances={distances} />
        </div>
      </div>
    </div>
  );
}
