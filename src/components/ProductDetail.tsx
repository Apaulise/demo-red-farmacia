"use client";

import { CalendarCheck, Check, ChevronRight, CreditCard, Info, MapPin, Store } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { getBranch } from "@/config/site";
import { getCategory, getProduct, modeFor, products } from "@/data/products";
import { ars, waLink } from "@/lib/format";
import { priceFor } from "@/lib/pricing";
import { trackView, trackWhatsApp, useStore } from "@/lib/store";
import { openBranchPicker } from "./BranchPicker";
import { WhatsAppIcon } from "./icons";
import { ProductArt } from "./ProductArt";
import { AddButton, ModeChip, ProductCard } from "./ProductCard";

export function ProductDetail({ id }: { id: string }) {
  const product = getProduct(id)!;
  const offers = useStore("offers");
  const branch = getBranch(useStore("branch"));
  const info = priceFor(product, offers);
  const cat = getCategory(product.category);
  const mode = modeFor(product.category);

  useEffect(() => {
    trackView(product.id);
  }, [product.id]);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a, b) => (a.sub === product.sub ? -1 : 1) - (b.sub === product.sub ? -1 : 1) || b.popularity - a.popularity)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 md:px-6 md:pt-8">
      <nav className="mb-4 flex items-center gap-1 text-xs text-ink-mute">
        <Link href="/productos" className="hover:text-brand">Productos</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/productos?cat=${cat.key}`} className="hover:text-brand">{cat.name}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-ink-soft">{product.sub}</span>
      </nav>

      <div className="grid gap-6 md:grid-cols-2 md:gap-12">
        <div className="relative animate-pop overflow-hidden rounded-[32px] border border-line">
          <ProductArt product={product} className="aspect-square w-full" />
          <div className="absolute left-4 top-4 flex flex-col gap-1.5">
            {info.badge && <span className="rounded-full bg-accent px-3 py-1 text-sm font-extrabold text-white shadow">{info.badge}</span>}
            {product.isNew && <span className="w-fit rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">Nuevo</span>}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ModeChip product={product} size="md" />
          <h1 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">{product.name}</h1>
          <p className="text-sm text-ink-mute">{product.size} · {product.sub}</p>

          <div className="flex items-end gap-3">
            <p className={`font-display text-4xl font-extrabold ${info.oldPrice ? "text-accent-600" : ""}`}>{ars(info.price)}</p>
            {info.oldPrice && (
              <>
                <p className="pb-1 text-lg text-ink-mute line-through">{ars(info.oldPrice)}</p>
                <span className="mb-1.5 rounded-full bg-accent-100 px-2 py-0.5 text-xs font-bold text-accent-600">
                  Ahorrás {ars(info.oldPrice - info.price)}
                </span>
              </>
            )}
          </div>
          {info.offer?.kind === "segunda" && (
            <p className="rounded-2xl bg-accent-50 px-4 py-3 text-sm font-semibold text-accent-600">
              🔥 Llevando 2, la segunda unidad tiene {info.offer.value}% de descuento ({info.offer.title}).
            </p>
          )}

          <p className="text-ink-soft">{product.description}</p>
          <ul className="grid gap-2 sm:grid-cols-3">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 rounded-2xl bg-surface px-3 py-2.5 text-sm font-semibold">
                <Check className="h-4 w-4 shrink-0 text-brand" /> {h}
              </li>
            ))}
          </ul>

          <div className={`rounded-3xl border p-4 ${mode === "online" ? "border-mp/25 bg-mp/5" : "border-accent/25 bg-accent-50"}`}>
            <div className="flex gap-3">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white ${mode === "online" ? "bg-mp" : "bg-accent"}`}>
                {mode === "online" ? <CreditCard className="h-5 w-5" /> : <CalendarCheck className="h-5 w-5" />}
              </span>
              <div className="text-sm">
                {mode === "online" ? (
                  <>
                    <p className="font-bold">Pagá online y retirá en la farmacia</p>
                    <p className="text-ink-soft">Asegurás tu compra con Mercado Pago y la retirás con tu código. Sin envíos a domicilio.</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold">Reservá online, pagá al retirar</p>
                    <p className="text-ink-soft">
                      Por normativa, los medicamentos de venta libre se abonan y se dispensan en la farmacia. Te lo separamos con tu código de reserva.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button onClick={openBranchPicker} className="flex items-center gap-3 rounded-3xl border border-line p-4 text-left transition hover:border-brand">
            <Store className="h-5 w-5 text-brand" />
            <span className="flex-1 text-sm">
              {branch ? (
                <>
                  Retirás en <b>{branch.name}</b>
                  <span className="block text-xs text-ink-mute">{branch.address} · {branch.hours}</span>
                </>
              ) : (
                <>
                  <b>Elegí tu farmacia</b> para retirar
                  <span className="block text-xs text-ink-mute">8 sucursales en Berazategui</span>
                </>
              )}
            </span>
            <MapPin className="h-4 w-4 text-ink-mute" />
          </button>

          <div className="sticky bottom-[72px] z-30 -mx-4 flex gap-2 border-t border-line bg-white/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
            <div className="flex-1">
              <AddButton product={product} full />
            </div>
            <a
              href={waLink(branch?.whatsapp ?? "5491155550101", `Hola! Quería consultar por: ${product.name} (${product.size}). ¿Lo tienen disponible?`)}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsApp(branch?.slug ?? "centro")}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-wa text-white shadow-lg shadow-wa/30 transition hover:scale-105"
              aria-label="Consultar por WhatsApp"
            >
              <WhatsAppIcon className="h-6 w-6" />
            </a>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-ink-mute">
            <Info className="h-3.5 w-3.5" /> Producto sujeto a disponibilidad en la sucursal elegida.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl font-extrabold">También te puede servir</h2>
          <div className="scroll-x -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-5 md:gap-4 md:px-0">
            {related.map((p) => (
              <div key={p.id} className="w-[46%] shrink-0 sm:w-[32%] md:w-auto">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
