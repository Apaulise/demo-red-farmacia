"use client";

import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import type { Offer } from "@/data/offers";
import { getProduct, products, type Product } from "@/data/products";
import { offerBadge } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { themeStyles } from "@/lib/themes";
import { openBranchPicker } from "../BranchPicker";
import { ProductArt } from "../ProductArt";

function offerProducts(o: Offer): Product[] {
  if (o.target.type === "productos") return o.target.value.map((id) => getProduct(id)).filter(Boolean) as Product[];
  const cat = o.target.value;
  return products.filter((p) => p.category === cat).slice(0, 3);
}

function Floating({ items }: { items: Product[] }) {
  const pos = [
    "right-[34%] top-[16%] w-[38%] md:w-[30%] [--r:-8deg]",
    "right-[4%] top-[6%] w-[40%] md:w-[33%] [--r:6deg] [animation-delay:-2s]",
    "right-[16%] bottom-[2%] w-[34%] md:w-[27%] [--r:-3deg] [animation-delay:-4s]",
  ];
  return (
    <>
      {items.slice(0, 3).map((p, i) => (
        <div key={p.id} className={`absolute animate-float drop-shadow-2xl ${pos[i]}`}>
          <ProductArt product={p} background={false} className="h-auto w-full" />
        </div>
      ))}
    </>
  );
}

export function HeroCarousel() {
  const offers = useStore("offers").filter((o) => o.active && o.featured);
  const slides = offers.length + 1;
  const [i, setI] = useState(0);
  const idx = i % slides;

  useEffect(() => {
    const t = setInterval(() => setI((x) => x + 1), 5500);
    return () => clearInterval(t);
  }, [slides]);

  const intro = [getProduct("p03"), getProduct("p11"), getProduct("p33")].filter(Boolean) as Product[];

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
      <div className="relative h-[540px] overflow-hidden rounded-[32px] md:h-[440px]">
        {/* Slide 0: marca */}
        <div
          className={`absolute inset-0 bg-brand text-white transition-all duration-700 ${idx === 0 ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <div className="dotted-bg absolute inset-0 opacity-30 mix-blend-overlay" />
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex h-full max-w-xl flex-col justify-end gap-4 p-6 pb-14 md:justify-center md:p-12">
            <span className="hidden w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur md:inline-block">
              {site.city} · 8 farmacias, un solo catálogo
            </span>
            <h1 className="font-display text-[34px] font-extrabold leading-[1.02] md:text-6xl">
              Comprá online.
              <br />
              <span className="text-[color:color-mix(in_oklab,var(--accent)_55%,white)]">Retirá en tu farmacia.</span>
            </h1>
            <p className="max-w-md text-sm text-white/85 md:text-base">
              Pagá con Mercado Pago o reservá y pagá en el local. Tu pedido te espera listo, sin filas.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/productos?ofertas=1" className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-brand-700 transition hover:gap-3">
                Ver ofertas <ArrowRight className="h-4 w-4" />
              </Link>
              <button onClick={openBranchPicker} className="flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/25">
                <MapPin className="h-4 w-4" /> Elegí tu farmacia
              </button>
            </div>
          </div>
          <div className="absolute inset-0 hidden md:block">
            <Floating items={intro} />
          </div>
          <div className="absolute right-0 top-4 w-[80%] md:hidden">
            <div className="relative h-[180px]">
              <Floating items={intro} />
            </div>
          </div>
        </div>

        {offers.map((o, n) => {
          const t = themeStyles[o.theme];
          const active = idx === n + 1;
          return (
            <div
              key={o.id}
              className={`absolute inset-0 transition-all duration-700 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
              style={{ background: t.bg, color: t.fg }}
            >
              <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full blur-3xl" style={{ background: t.soft, opacity: 0.6 }} />
              <div className="relative z-10 flex h-full max-w-xl flex-col justify-end gap-3 p-6 pb-14 md:justify-center md:p-12">
                <span className="w-fit rounded-full px-3 py-1 text-xs font-bold" style={{ background: t.chip }}>
                  {o.validUntil}
                </span>
                <p className="font-display text-6xl font-extrabold leading-none md:text-8xl">{offerBadge(o)}</p>
                <h2 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">{o.title}</h2>
                <p className="max-w-sm text-sm opacity-85 md:text-base">{o.subtitle}</p>
                <Link
                  href={`/productos?oferta=${o.id}`}
                  className="mt-1 flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition hover:gap-3"
                  style={{ background: t.fg, color: t.bg }}
                >
                  Aprovechar <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="absolute inset-0 hidden md:block">
                <Floating items={offerProducts(o)} />
              </div>
              <div className="absolute right-0 top-3 w-[72%] md:hidden">
                <div className="relative h-[170px]">
                  <Floating items={offerProducts(o)} />
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-5 left-6 z-20 flex gap-1.5 md:left-12">
          {Array.from({ length: slides }).map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Ir al slide ${n + 1}`}
              className={`h-2 rounded-full transition-all ${idx === n ? "w-7 bg-white" : "w-2 bg-white/45"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
