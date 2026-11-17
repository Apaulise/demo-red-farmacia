import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetail } from "@/components/ProductDetail";
import { site } from "@/config/site";
import { getCategory, getProduct, products } from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name} (${p.size}). ${p.description} Retiralo en tu farmacia de ${site.name} en ${site.city}.`,
    alternates: { canonical: `/productos/${p.slug}` },
    openGraph: { title: `${p.name} · ${site.name}`, description: p.description },
  };
}

export default function ProductPage({ params }: PageProps<"/productos/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-[80vh] max-w-7xl" />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const cat = getCategory(product.category);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: cat.name,
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: site.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
      availableDeliveryMethod: "https://schema.org/OnSitePickup",
      seller: { "@type": "Organization", name: site.name },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ProductDetail id={product.id} />
    </>
  );
}
