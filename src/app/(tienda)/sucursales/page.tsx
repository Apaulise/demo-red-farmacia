import type { Metadata } from "next";
import { BranchCard } from "@/components/BranchCard";
import { BranchMap } from "@/components/BranchMap";
import { branches, site } from "@/config/site";
import { ld, pharmacyLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: `Sucursales en ${site.city}`,
  description: `Las ${branches.length} farmacias de ${site.name} en ${site.city}: direcciones, horarios, farmacia 24 horas y WhatsApp de cada sucursal.`,
  alternates: { canonical: "/sucursales" },
};

export default function BranchesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6 md:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(branches.map(pharmacyLd))} />
      <p className="text-xs font-bold uppercase tracking-wider text-brand">Retiro en sucursal</p>
      <h1 className="font-display text-3xl font-extrabold md:text-5xl">Nuestras {branches.length} farmacias</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Elegí dónde retirar. Todas comparten el mismo catálogo y las mismas promos, y cada una te atiende por su propio WhatsApp.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <BranchMap />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {branches.map((b) => (
            <BranchCard key={b.slug} branch={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
