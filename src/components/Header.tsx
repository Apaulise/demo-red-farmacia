"use client";

import { ChevronDown, MapPin, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getBranch } from "@/config/site";
import { categories } from "@/data/products";
import { useStore } from "@/lib/store";
import { openBranchPicker } from "./BranchPicker";
import { Logo } from "./Logo";

const announcements = [
  "Pagá online y retirá en tu farmacia, sin filas",
  "Retiro en 8 sucursales de Berazategui · sin envíos",
  "Venta libre: reservá online y pagá en el local",
  "¿Tenés receta? Mandá la foto y te respondemos por WhatsApp",
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const branch = getBranch(useStore("branch"));
  const cart = useStore("cart");
  const count = cart.reduce((a, i) => a + i.qty, 0);
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/productos${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="overflow-hidden bg-ink py-1.5 text-[12px] font-medium text-white/85">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...announcements, ...announcements].map((a, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent" /> {a}
            </span>
          ))}
        </div>
      </div>
      <div className="border-b border-line bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6 md:px-6">
          <Logo />
          <form onSubmit={submit} className="relative hidden flex-1 md:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscá protector solar, pañales, ibuprofeno…"
              className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-[15px] outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </form>
          <button
            onClick={openBranchPicker}
            className="ml-auto hidden items-center gap-2 rounded-full border border-line px-3 py-2 text-left transition hover:border-brand md:flex"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-brand">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] text-ink-mute">Retirás en</span>
              <span className="block text-sm font-bold">{branch ? branch.name : "Elegí tu farmacia"}</span>
            </span>
            <ChevronDown className="h-4 w-4 text-ink-mute" />
          </button>
          <Link
            href="/carrito"
            className="relative ml-auto grid h-11 w-11 place-items-center rounded-full bg-brand text-white shadow-md shadow-brand/30 transition hover:bg-brand-700 md:ml-0"
            aria-label={`Carrito (${count})`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span key={count} className="absolute -right-1 -top-1 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-accent px-1 text-[11px] font-extrabold text-white ring-2 ring-white">
                {count}
              </span>
            )}
          </Link>
        </div>
        {/* Mobile: buscador + sucursal */}
        <div className="space-y-2 px-4 pb-3 md:hidden">
          <form onSubmit={submit} className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="¿Qué estás buscando?"
              className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-[15px] outline-none focus:border-brand focus:bg-white"
            />
          </form>
          <button onClick={openBranchPicker} className="flex w-full items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-brand" />
            <span className="text-ink-soft">Retirás en</span>
            <span className="font-bold">{branch ? branch.name : "Elegí tu farmacia"}</span>
            <ChevronDown className="h-4 w-4 text-ink-mute" />
          </button>
        </div>
        <nav className="scroll-x hidden border-t border-line md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 md:px-6">
            {[
              { href: "/productos?ofertas=1", label: "🔥 Ofertas", hot: true },
              ...categories.map((c) => ({ href: `/productos?cat=${c.key}`, label: c.name, hot: false })),
              { href: "/receta", label: "Cargar receta", hot: false },
              { href: "/sucursales", label: "Sucursales", hot: false },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-semibold transition hover:text-brand ${
                  l.hot ? "text-accent" : pathname === l.href ? "text-brand" : "text-ink-soft"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
