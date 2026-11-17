"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { categories, modeFor, products, type CategoryKey } from "@/data/products";
import { offersFor, priceFor } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { ProductCard } from "./ProductCard";

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const SORTS = [
  { key: "relevancia", label: "Destacados" },
  { key: "populares", label: "Más vendidos" },
  { key: "menor", label: "Menor precio" },
  { key: "mayor", label: "Mayor precio" },
  { key: "descuento", label: "Mayor descuento" },
];

export function Catalog() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const offers = useStore("offers");

  const q = params.get("q") ?? "";
  const cat = params.get("cat") as CategoryKey | null;
  const sub = params.get("sub");
  const onlyOffers = params.get("ofertas") === "1";
  const offerId = params.get("oferta");
  const mode = params.get("modo");
  const sort = params.get("orden") ?? "relevancia";

  const setParam = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    const s = next.toString();
    router.replace(`${pathname}${s ? `?${s}` : ""}`, { scroll: false });
  };

  const activeOffer = offerId ? offers.find((o) => o.id === offerId) : undefined;

  const list = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    let l = products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (sub && p.sub !== sub) return false;
      if (mode && modeFor(p.category) !== mode) return false;
      const pOffers = offersFor(p, offers);
      if (onlyOffers && pOffers.length === 0) return false;
      if (offerId && !pOffers.some((o) => o.id === offerId)) return false;
      if (words.length) {
        const hay = norm(`${p.name} ${p.sub} ${p.category} ${p.description} ${p.label}`);
        return words.every((w) => hay.includes(w));
      }
      return true;
    });
    const price = (id: string) => priceFor(products.find((p) => p.id === id)!, offers);
    if (sort === "populares") l = [...l].sort((a, b) => b.popularity - a.popularity);
    if (sort === "menor") l = [...l].sort((a, b) => price(a.id).price - price(b.id).price);
    if (sort === "mayor") l = [...l].sort((a, b) => price(b.id).price - price(a.id).price);
    if (sort === "descuento")
      l = [...l].sort((a, b) => {
        const d = (id: string) => {
          const i = price(id);
          return i.oldPrice ? 1 - i.price / i.oldPrice : i.offer ? 0.1 : 0;
        };
        return d(b.id) - d(a.id);
      });
    if (sort === "relevancia")
      l = [...l].sort((a, b) => {
        const score = (x: typeof a) => (offersFor(x, offers).length ? 60 : 0) + x.popularity;
        return score(b) - score(a);
      });
    return l;
  }, [q, cat, sub, mode, onlyOffers, offerId, sort, offers]);

  const subs = cat ? [...new Set(products.filter((p) => p.category === cat).map((p) => p.sub))] : [];
  const catInfo = cat ? categories.find((c) => c.key === cat) : undefined;

  const title = activeOffer
    ? activeOffer.title
    : q
      ? `Resultados para “${q}”`
      : onlyOffers
        ? "Ofertas y promos"
        : (catInfo?.name ?? "Todos los productos");

  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
      active ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand-300"
    }`;

  const hasFilters = !!(q || cat || sub || onlyOffers || offerId || mode);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6 md:pt-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand">Catálogo de la red</p>
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">{title}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {catInfo ? catInfo.description : activeOffer ? activeOffer.subtitle : "Mismo catálogo y mismos precios en las 8 sucursales."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-ink-mute" />
          <select
            value={sort}
            onChange={(e) => setParam({ orden: e.target.value === "relevancia" ? null : e.target.value })}
            className="h-10 rounded-full border border-line bg-white px-3 text-sm font-semibold outline-none focus:border-brand"
            aria-label="Ordenar"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[230px_1fr]">
        {/* Filtros */}
        <aside className="min-w-0 space-y-4 md:sticky md:top-40 md:self-start">
          <div className="relative md:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
            <input
              defaultValue={q}
              key={q}
              onKeyDown={(e) => e.key === "Enter" && setParam({ q: (e.target as HTMLInputElement).value })}
              onBlur={(e) => e.target.value !== q && setParam({ q: e.target.value })}
              placeholder="Filtrar por nombre…"
              className="h-11 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm outline-none focus:border-brand focus:bg-white"
            />
          </div>
          <div className="scroll-x -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-col md:items-stretch md:px-0">
            <button className={chip(!cat && !onlyOffers)} onClick={() => setParam({ cat: null, sub: null, ofertas: null, oferta: null })}>
              Todo
            </button>
            <button className={`${chip(onlyOffers)} ${onlyOffers ? "" : "text-accent"}`} onClick={() => setParam({ ofertas: onlyOffers ? null : "1", oferta: null })}>
              🔥 Ofertas
            </button>
            {categories.map((c) => (
              <button key={c.key} className={`${chip(cat === c.key)} md:text-left`} onClick={() => setParam({ cat: cat === c.key ? null : c.key, sub: null })}>
                {c.name}
              </button>
            ))}
          </div>
          {subs.length > 1 && (
            <div className="scroll-x -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
              {subs.map((s) => (
                <button
                  key={s}
                  onClick={() => setParam({ sub: sub === s ? null : s })}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition ${sub === s ? "bg-ink text-white" : "bg-surface text-ink-soft hover:bg-brand-100"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="hidden space-y-2 rounded-2xl bg-surface p-4 md:block">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-mute">Forma de compra</p>
            {[
              { k: null, l: "Todas" },
              { k: "online", l: "Pago online + retiro" },
              { k: "reserva", l: "Reserva, pagás en el local" },
            ].map((m) => (
              <label key={m.l} className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="radio" name="modo" checked={mode === m.k} onChange={() => setParam({ modo: m.k })} className="accent-[var(--brand)]" />
                {m.l}
              </label>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between text-sm text-ink-mute">
            <span>
              <b className="text-ink">{list.length}</b> productos
            </span>
            {hasFilters && (
              <button
                onClick={() => router.replace(pathname, { scroll: false })}
                className="flex items-center gap-1 font-semibold text-brand hover:underline"
              >
                <X className="h-3.5 w-3.5" /> Limpiar filtros
              </button>
            )}
          </div>
          {list.length === 0 ? (
            <div className="grid place-items-center rounded-3xl bg-surface px-6 py-20 text-center">
              <p className="font-display text-2xl font-extrabold">No encontramos “{q}”</p>
              <p className="mt-1 text-sm text-ink-soft">Probá con otra palabra o mandanos la consulta por WhatsApp a tu sucursal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 xl:grid-cols-4">
              {list.map((p, i) => (
                <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
