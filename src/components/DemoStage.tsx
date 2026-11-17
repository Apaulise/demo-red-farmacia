"use client";

import { LayoutDashboard, RotateCcw, Smartphone } from "lucide-react";
import { useState } from "react";
import { site } from "@/config/site";
import { resetDemo } from "@/lib/store";
import { LogoMark } from "./Logo";
import { toast } from "./Toaster";

/**
 * Modo presentación: la tienda en un celular y el panel de la red al lado.
 * Comparten el mismo almacenamiento, así que un pedido hecho en el celular
 * aparece al instante en el panel (ideal para grabar el Loom).
 */
export function DemoStage() {
  const [key, setKey] = useState(0);
  return (
    <div className="min-h-screen bg-[#0B1714] text-white">
      <header className="flex flex-wrap items-center gap-3 px-6 py-4">
        <LogoMark />
        <div className="leading-tight">
          <p className="font-display text-lg font-extrabold">{site.name}</p>
          <p className="text-xs text-white/60">Modo presentación · tienda + panel en vivo</p>
        </div>
        <button
          onClick={() => {
            resetDemo();
            setKey((k) => k + 1);
            toast("Demo reiniciada");
          }}
          className="ml-auto flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
        >
          <RotateCcw className="h-4 w-4" /> Reiniciar demo
        </button>
      </header>
      <div className="flex flex-col items-center gap-8 px-6 pb-10 xl:flex-row xl:items-start xl:justify-center">
        <div className="shrink-0">
          <p className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold text-white/70">
            <Smartphone className="h-4 w-4" /> El cliente, desde el celular
          </p>
          <div className="relative rounded-[54px] bg-[#1d2a26] p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/10">
            <div className="absolute left-1/2 top-5 z-10 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />
            <iframe key={`s${key}`} src="/" title="Tienda en el celular" className="h-[812px] w-[375px] rounded-[42px] bg-white" />
          </div>
        </div>
        <div className="w-full max-w-[1100px] flex-1">
          <p className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold text-white/70">
            <LayoutDashboard className="h-4 w-4" /> La farmacia, en el panel de la red
          </p>
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/10">
            <div className="flex items-center gap-2 bg-[#E9ECEA] px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 flex-1 rounded-md bg-white px-3 py-1 text-xs text-ink-mute">{site.url.replace("https://", "")}/admin</span>
            </div>
            <iframe key={`a${key}`} src="/admin" title="Panel de la red" className="h-[800px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
