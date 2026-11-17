"use client";

import { Eye, Pencil, Plus, Search, Sparkles, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Offer, OfferTheme } from "@/data/offers";
import { categories, getProduct, products, type CategoryKey } from "@/data/products";
import { offerBadge, offersFor, priceFor } from "@/lib/pricing";
import { ars } from "@/lib/format";
import { deleteOffer, saveOffer, useHydrated, useStore } from "@/lib/store";
import { themeStyles } from "@/lib/themes";
import { ProductArt } from "../ProductArt";
import { toast } from "../Toaster";

const blank = (): Offer => ({
  id: `of-${Math.random().toString(36).slice(2, 7)}`,
  title: "Semana del bebé",
  subtitle: "30% off en toallitas y cremas para bebé",
  kind: "porcentaje",
  value: 30,
  target: { type: "productos", value: ["p35", "p36"] },
  active: true,
  featured: true,
  theme: "sky",
  validUntil: "Hasta el domingo",
});

function heroProduct(o: Offer) {
  const id = o.target.type === "productos" ? o.target.value[0] : products.find((p) => p.category === o.target.value)?.id;
  return getProduct(id ?? "p01");
}

function Preview({ o }: { o: Offer }) {
  const t = themeStyles[o.theme];
  const p = heroProduct(o);
  return (
    <div className="relative grid aspect-[16/9] grid-cols-[1.2fr_1fr] items-center overflow-hidden rounded-3xl p-5" style={{ background: t.bg, color: t.fg }}>
      <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full blur-2xl" style={{ background: t.soft, opacity: 0.6 }} />
      <div className="relative">
        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: t.chip }}>{o.validUntil || "—"}</span>
        <p className="mt-2 font-display text-4xl font-extrabold leading-none">{offerBadge(o)}</p>
        <p className="mt-1 font-display text-lg font-extrabold leading-tight">{o.title || "Título de la promo"}</p>
        <p className="mt-1 text-xs opacity-85">{o.subtitle}</p>
      </div>
      {p && <ProductArt product={p} background={false} className="relative w-full animate-float drop-shadow-xl" />}
    </div>
  );
}

function Editor({ initial, isNew, onClose }: { initial: Offer; isNew: boolean; onClose: () => void }) {
  const [o, setO] = useState<Offer>(initial);
  const [q, setQ] = useState("");
  const set = (patch: Partial<Offer>) => setO((x) => ({ ...x, ...patch }));
  const selected = o.target.type === "productos" ? o.target.value : [];
  const toggleProduct = (id: string) =>
    set({ target: { type: "productos", value: selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id] } });
  const matches = products.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 40);
  const valid = o.title.trim() && o.value > 0 && o.value <= 90 && (o.target.type === "categoria" || selected.length > 0);

  const input = "mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm font-normal outline-none focus:border-brand focus:bg-white";

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal>
      <button className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} aria-label="Cerrar" />
      <div className="relative flex h-full w-full max-w-xl animate-[fade-up_.3s_ease] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-extrabold">{isNew ? "Nueva oferta" : "Editar oferta"}</h2>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-surface" aria-label="Cerrar"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <Preview o={o} />
          <label className="block text-sm font-semibold">
            Título
            <input className={input} value={o.title} onChange={(e) => set({ title: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold">
            Bajada
            <input className={input} value={o.subtitle} onChange={(e) => set({ subtitle: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-semibold">
              Tipo
              <select className={input} value={o.kind} onChange={(e) => set({ kind: e.target.value as Offer["kind"] })}>
                <option value="porcentaje">% de descuento</option>
                <option value="segunda">2da unidad al X% off</option>
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Descuento (%)
              <input className={input} type="number" min={5} max={90} step={5} value={o.value} onChange={(e) => set({ value: Number(e.target.value) })} />
            </label>
          </div>
          <label className="block text-sm font-semibold">
            Vigencia (texto)
            <input className={input} value={o.validUntil} onChange={(e) => set({ validUntil: e.target.value })} />
          </label>
          <div>
            <p className="text-sm font-semibold">Color</p>
            <div className="mt-1.5 flex gap-2">
              {(Object.keys(themeStyles) as OfferTheme[]).map((k) => (
                <button
                  key={k}
                  onClick={() => set({ theme: k })}
                  className={`h-9 w-9 rounded-full ring-offset-2 transition ${o.theme === k ? "ring-2 ring-ink" : ""}`}
                  style={{ background: themeStyles[k].bg }}
                  aria-label={themeStyles[k].label}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Aplica a</p>
            <div className="mt-1.5 flex gap-2">
              <button
                onClick={() => set({ target: { type: "productos", value: selected.length ? selected : [] } })}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${o.target.type === "productos" ? "bg-ink text-white" : "bg-surface"}`}
              >
                Productos elegidos
              </button>
              <button
                onClick={() => set({ target: { type: "categoria", value: o.target.type === "categoria" ? o.target.value : "perfumeria" } })}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${o.target.type === "categoria" ? "bg-ink text-white" : "bg-surface"}`}
              >
                Toda una categoría
              </button>
            </div>
            {o.target.type === "categoria" ? (
              <select className={input} value={o.target.value} onChange={(e) => set({ target: { type: "categoria", value: e.target.value as CategoryKey } })}>
                {categories.filter((c) => c.mode === "online").map((c) => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
            ) : (
              <div className="mt-2 rounded-2xl border border-line">
                <div className="relative border-b border-line">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto…" className="h-10 w-full rounded-t-2xl pl-9 pr-3 text-sm outline-none" />
                </div>
                <ul className="max-h-52 overflow-y-auto p-1">
                  {matches.map((p) => (
                    <li key={p.id}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-surface">
                        <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleProduct(p.id)} className="accent-[var(--brand)]" />
                        <span className="w-7 shrink-0 overflow-hidden rounded-md"><ProductArt product={p} className="aspect-square w-full" /></span>
                        <span className="flex-1 truncate">{p.name}</span>
                        <span className="text-xs text-ink-mute">{ars(p.price)}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <p className="border-t border-line px-3 py-2 text-xs text-ink-mute">{selected.length} productos seleccionados</p>
              </div>
            )}
            <p className="mt-2 text-[11px] text-ink-mute">
              Las promos con descuento se aplican a perfumería, dermo, bebés y cuidado personal. Los medicamentos de venta libre no se promocionan online.
            </p>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={o.active} onChange={(e) => set({ active: e.target.checked })} className="h-4 w-4 accent-[var(--brand)]" /> Activa
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={o.featured} onChange={(e) => set({ featured: e.target.checked })} className="h-4 w-4 accent-[var(--brand)]" /> Destacada en el inicio
            </label>
          </div>
        </div>
        <div className="flex gap-2 border-t border-line p-4">
          <button onClick={onClose} className="h-12 flex-1 rounded-full bg-surface font-bold">Cancelar</button>
          <button
            disabled={!valid}
            onClick={() => {
              const clean = o.target.type === "productos"
                ? { ...o, target: { type: "productos" as const, value: o.target.value.filter((id) => getProduct(id)?.category !== "venta-libre") } }
                : o;
              saveOffer(clean);
              toast("Oferta publicada", "Ya se ve en la tienda y en las piezas para redes");
              onClose();
            }}
            className="h-12 flex-[2] rounded-full bg-brand font-bold text-white shadow-lg shadow-brand/25 disabled:opacity-50"
          >
            Guardar y publicar
          </button>
        </div>
      </div>
    </div>
  );
}

export function OffersAdmin() {
  const hydrated = useHydrated();
  const offers = useStore("offers");
  const [editing, setEditing] = useState<Offer | null>(null);
  if (!hydrated) return <div className="h-[60vh]" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-ink-soft">
          Las ofertas son de toda la red: se publican al instante en el catálogo, el carrusel del inicio y las piezas para Instagram.
        </p>
        <div className="flex gap-2">
          <Link href="/" target="_blank" className="flex h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-bold">
            <Eye className="h-4 w-4" /> Ver en la tienda
          </Link>
          <button onClick={() => setEditing(blank())} className="flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-bold text-white shadow-lg shadow-brand/25">
            <Plus className="h-4 w-4" /> Nueva oferta
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((o) => {
          const affected = products.filter((p) => offersFor(p, [{ ...o, active: true }]).length);
          const t = themeStyles[o.theme];
          return (
            <article key={o.id} className={`overflow-hidden rounded-3xl border border-line bg-white transition ${o.active ? "" : "opacity-60"}`}>
              <div className="flex items-center gap-3 p-4" style={{ background: t.bg, color: t.fg }}>
                <p className="font-display text-3xl font-extrabold leading-none">{offerBadge(o)}</p>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{o.title}</p>
                  <p className="truncate text-xs opacity-80">{o.validUntil}</p>
                </div>
                {o.featured && <Sparkles className="h-5 w-5 shrink-0 opacity-80" aria-label="Destacada" />}
              </div>
              <div className="space-y-3 p-4">
                <p className="text-sm text-ink-soft">{o.subtitle}</p>
                <div className="flex -space-x-2">
                  {affected.slice(0, 6).map((p) => (
                    <span key={p.id} className="w-10 overflow-hidden rounded-xl border-2 border-white" title={`${p.name} · ${ars(priceFor(p, [{ ...o, active: true }]).price)}`}>
                      <ProductArt product={p} className="aspect-square w-full" />
                    </span>
                  ))}
                  {affected.length > 6 && <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-white bg-surface text-xs font-bold">+{affected.length - 6}</span>}
                </div>
                <div className="flex items-center justify-between border-t border-line pt-3">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                    <span className={`relative h-6 w-11 rounded-full transition ${o.active ? "bg-brand" : "bg-ink/20"}`}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${o.active ? "left-[22px]" : "left-0.5"}`} />
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={o.active}
                      onChange={(e) => {
                        saveOffer({ ...o, active: e.target.checked });
                        toast(e.target.checked ? "Oferta activada" : "Oferta pausada", o.title);
                      }}
                    />
                    {o.active ? "Activa" : "Pausada"}
                  </label>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(o)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface" aria-label="Editar">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        deleteOffer(o.id);
                        toast("Oferta eliminada", o.title);
                      }}
                      className="grid h-9 w-9 place-items-center rounded-full text-ink-mute hover:bg-accent-50 hover:text-accent"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {editing && <Editor initial={editing} isNew={!offers.some((x) => x.id === editing.id)} onClose={() => setEditing(null)} />}
    </div>
  );
}
