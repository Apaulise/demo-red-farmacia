import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BranchCard } from "@/components/BranchCard";
import { BranchMap } from "@/components/BranchMap";
import { BestSellersRail } from "@/components/home/Sections";
import { branches, getBranch, site } from "@/config/site";
import { ld, pharmacyLd } from "@/lib/schema";

export function generateStaticParams() {
  return branches.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sucursales/[slug]">): Promise<Metadata> {
  const b = getBranch((await params).slug);
  if (!b) return {};
  return {
    title: `Farmacia en ${b.neighborhood} · ${b.name}`,
    description: `${site.name} ${b.name}: ${b.address}, ${b.neighborhood}, ${site.city}. ${b.hours}. Comprá online y retirá en esta sucursal.`,
    alternates: { canonical: `/sucursales/${b.slug}` },
  };
}

export default function BranchPage({ params }: PageProps<"/sucursales/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-[80vh] max-w-7xl" />}>
      <BranchContent params={params} />
    </Suspense>
  );
}

async function BranchContent({ params }: { params: Promise<{ slug: string }> }) {
  const b = getBranch((await params).slug);
  if (!b) notFound();
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6 md:pt-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={ld(pharmacyLd(b))} />
        <Link href="/sucursales" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-brand">
          <ArrowLeft className="h-4 w-4" /> Todas las sucursales
        </Link>
        <p className="text-xs font-bold uppercase tracking-wider text-brand">{site.name} · {b.neighborhood}</p>
        <h1 className="font-display text-3xl font-extrabold md:text-5xl">Farmacia {b.name}</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <BranchMap selected={b.slug} />
          <BranchCard branch={b} detailed />
        </div>
      </div>
      <BestSellersRail />
    </>
  );
}
