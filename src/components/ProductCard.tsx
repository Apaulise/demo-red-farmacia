"use client";

import { CalendarCheck, CreditCard, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { modeFor, type Product } from "@/data/products";
import { ars } from "@/lib/format";
import { priceFor } from "@/lib/pricing";
import { cart, useStore } from "@/lib/store";
import { ProductArt } from "./ProductArt";
import { toast } from "./Toaster";

export function ModeChip({ product, size = "sm" }: { product: Pick<Product, "category">; size?: "sm" | "md" }) {
  const mode = modeFor(product.category);
  const cls = size === "sm" ? "text-[10.5px] px-2 py-0.5 gap-1" : "text-xs px-2.5 py-1 gap-1.5";
  return mode === "online" ? (
    <span className={`inline-flex items-center rounded-full bg-mp/10 font-bold text-[#0077B6] ${cls}`}>
      <CreditCard className="h-3 w-3" /> Pagá online
    </span>
  ) : (
    <span className={`inline-flex items-center rounded-full bg-accent-100 font-bold text-accent-600 ${cls}`}>
      <CalendarCheck className="h-3 w-3" /> Reservá y pagá en el local
    </span>
  );
}

export function AddButton({ product, full = false }: { product: Product; full?: boolean }) {
  const items = useStore("cart");
  const inCart = items.find((i) => i.id === product.id);
  const mode = modeFor(product.category);

  const add = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cart.add(product.id);
    toast(mode === "online" ? "Agregado al carrito" : "Agregado a tu reserva", product.name);
  };

  if (inCart) {
    return (
      <div
        className={`flex items-center justify-between rounded-full bg-brand text-white ${full ? "h-12 w-full px-2" : "h-10 w-[104px] px-1"}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <button aria-label="Quitar uno" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15" onClick={() => cart.set(product.id, inCart.qty - 1)}>
          <Minus className="h-4 w-4" />
        </button>
        <span key={inCart.qty} className="animate-pop text-sm font-extrabold">{inCart.qty}</span>
        <button aria-label="Sumar uno" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15" onClick={() => cart.set(product.id, inCart.qty + 1)}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={add}
      className={`group/add flex items-center justify-center gap-1.5 rounded-full font-bold transition active:scale-95 ${
        full
          ? "h-12 w-full bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-700"
          : "h-10 w-10 bg-brand-100 text-brand hover:bg-brand hover:text-white"
      }`}
      aria-label={`Agregar ${product.name}`}
    >
      <Plus className="h-5 w-5 transition group-hover/add:rotate-90" />
      {full && (mode === "online" ? "Agregar al carrito" : "Agregar a la reserva")}
    </button>
  );
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const offers = useStore("offers");
  const info = priceFor(product, offers);
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="card-hover group flex flex-col overflow-hidden rounded-3xl border border-line bg-white"
      data-priority={priority || undefined}
    >
      <div className="relative">
        <ProductArt product={product} className="aspect-square w-full transition duration-500 group-hover:scale-[1.04]" />
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
          {info.badge && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-extrabold text-white shadow-sm">{info.badge}</span>
          )}
          {product.isNew && <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-white">Nuevo</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3 md:p-4">
        <ModeChip product={product} />
        <h3 className="line-clamp-2 text-[13.5px] font-semibold leading-snug md:text-[14.5px]">{product.name}</h3>
        <p className="text-xs text-ink-mute">{product.size}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="leading-tight">
            {info.oldPrice && <p className="text-xs text-ink-mute line-through">{ars(info.oldPrice)}</p>}
            <p className={`font-display text-lg font-extrabold md:text-xl ${info.oldPrice ? "text-accent-600" : ""}`}>{ars(info.price)}</p>
          </div>
          <AddButton product={product} />
        </div>
      </div>
    </Link>
  );
}
