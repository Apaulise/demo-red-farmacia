"use client";

import { ArrowRight, Heart, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { site } from "@/config/site";
import type { Offer } from "@/data/offers";
import { getProduct, products, type Product } from "@/data/products";
import { offerBadge, offersFor } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { themeStyles } from "@/lib/themes";
import { InstagramIcon } from "../icons";
import { LogoMark } from "../Logo";
import { ProductArt } from "../ProductArt";
import { ProductCard } from "../ProductCard";

export function Rail({ title, kicker, href, items }: { title: string; kicker?: string; href: string; items: Product[] }) {
  return (
    <section className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          {kicker && <p className="text-xs font-bold uppercase tracking-wider text-accent">{kicker}</p>}
          <h2 className="font-display text-2xl font-extrabold md:text-3xl">{title}</h2>
        </div>
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-bold text-brand hover:gap-2">
          Ver todo <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="scroll-x -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:px-0">
        {items.slice(0, 10).map((p, i) => (
          <div key={p.id} className={`w-[46%] shrink-0 sm:w-[32%] md:w-auto ${i >= 5 ? "md:hidden" : ""}`}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function OffersRail() {
  const offers = useStore("offers");
  const items = products.filter((p) => offersFor(p, offers).length > 0);
  return <Rail kicker="Promos de la semana" title="Ofertas que vuelan" href="/productos?ofertas=1" items={items} />;
}

export function BestSellersRail() {
  const items = [...products].sort((a, b) => b.popularity - a.popularity);
  return <Rail kicker="Lo que más se lleva Berazategui" title="Más vendidos de la red" href="/productos?orden=populares" items={items} />;
}

function offerHero(o: Offer) {
  const id = o.target.type === "productos" ? o.target.value[0] : products.find((p) => p.category === o.target.value)?.id;
  return getProduct(id ?? "p01")!;
}

/** Piezas pensadas para redes: post 1:1 e historia 9:16 a partir de las ofertas activas */
export function SocialPromos() {
  const offers = useStore("offers").filter((o) => o.active).slice(0, 3);
  if (!offers.length) return null;
  const [story, ...posts] = offers;
  const st = themeStyles[story.theme];
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 md:px-6">
      <div className="overflow-hidden rounded-[32px] bg-ink text-white">
        <div className="grid gap-8 p-6 md:grid-cols-[1fr_1.4fr] md:p-12">
          <div className="flex flex-col justify-center gap-4">
            <span className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
              <InstagramIcon className="h-3.5 w-3.5" /> {site.social.instagram}
            </span>
            <h2 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">
              Promos que nacen en redes y se retiran en el barrio.
            </h2>
            <p className="text-white/70">
              Cada oferta que cargás en el panel se convierte en piezas listas para Instagram, Facebook y estados de WhatsApp,
              con link directo a la compra y retiro en la sucursal más cercana.
            </p>
            <Link href="/productos?ofertas=1" className="flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white transition hover:gap-3">
              Ver todas las promos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-4">
            {/* Historia 9:16 */}
            <div className="relative aspect-[9/16] w-[42%] max-w-[220px] shrink-0 overflow-hidden rounded-[22px] shadow-2xl ring-4 ring-white/10" style={{ background: st.bg, color: st.fg }}>
              <div className="absolute inset-x-3 top-2.5 flex gap-1">
                <span className="h-0.5 flex-1 rounded bg-white/90" />
                <span className="h-0.5 flex-1 rounded bg-white/40" />
              </div>
              <div className="absolute left-3 top-5 flex items-center gap-1.5 text-[10px] font-bold">
                <LogoMark className="h-5 w-5 rounded-md" /> {site.social.instagram.replace("@", "")}
              </div>
              <div className="flex h-full flex-col items-center justify-center gap-1 p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{story.validUntil}</p>
                <p className="font-display text-4xl font-extrabold leading-none">{offerBadge(story)}</p>
                <p className="font-display text-sm font-extrabold">{story.title}</p>
                <ProductArt product={offerHero(story)} background={false} className="my-1 w-[80%] animate-float drop-shadow-xl" />
                <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold text-ink">Retirá hoy en tu sucursal ↗</span>
              </div>
            </div>
            {/* Posts 1:1 */}
            <div className="flex w-[52%] max-w-[300px] flex-col gap-4">
              {posts.map((o) => {
                const t = themeStyles[o.theme];
                return (
                  <div key={o.id} className="overflow-hidden rounded-2xl bg-white text-ink shadow-2xl">
                    <div className="flex items-center gap-1.5 px-2.5 py-2 text-[10px] font-bold">
                      <LogoMark className="h-5 w-5 rounded-md" /> {site.social.instagram.replace("@", "")}
                    </div>
                    <div className="relative grid aspect-square grid-cols-[1fr_1fr] items-center p-3" style={{ background: t.bg, color: t.fg }}>
                      <div>
                        <p className="font-display text-2xl font-extrabold leading-none md:text-3xl">{offerBadge(o)}</p>
                        <p className="mt-1 text-[11px] font-bold leading-tight">{o.title}</p>
                      </div>
                      <ProductArt product={offerHero(o)} background={false} className="w-full drop-shadow-lg" />
                    </div>
                    <div className="flex items-center gap-3 px-2.5 py-2 text-ink-soft">
                      <Heart className="h-4 w-4" /> <MessageCircle className="h-4 w-4" /> <Send className="h-4 w-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
