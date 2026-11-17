import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog } from "@/components/Catalog";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Productos y ofertas",
  description: `Catálogo compartido de las farmacias de ${site.name} en ${site.city}: dermocosmética, perfumería, cuidado personal, bebés y venta libre. Retiro en sucursal.`,
  alternates: { canonical: "/productos" },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto h-[60vh] max-w-7xl" />}>
      <Catalog />
    </Suspense>
  );
}
