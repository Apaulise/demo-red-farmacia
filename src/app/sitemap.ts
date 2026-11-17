import type { MetadataRoute } from "next";
import { branches, site } from "@/config/site";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/productos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/sucursales`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/receta`, changeFrequency: "monthly", priority: 0.7 },
    ...branches.map((b) => ({ url: `${base}/sucursales/${b.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/productos/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
