import { site, type Branch } from "@/config/site";

/** schema.org Pharmacy (LocalBusiness) por sucursal para SEO local en Google */
export function pharmacyLd(b: Branch) {
  return {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    "@id": `${site.url}/sucursales/${b.slug}#pharmacy`,
    name: `${site.name} ${b.name}`,
    url: `${site.url}/sucursales/${b.slug}`,
    telephone: `+${b.whatsapp}`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address,
      addressLocality: `${b.neighborhood}, ${site.city}`,
      addressRegion: site.region,
      addressCountry: "AR",
    },
    geo: { "@type": "GeoCoordinates", latitude: b.geo.lat, longitude: b.geo.lng },
    openingHours: b.openingHours,
    parentOrganization: { "@type": "Organization", name: site.name, url: site.url },
    hasOfferCatalog: { "@type": "OfferCatalog", name: "Catálogo de la red", url: `${site.url}/productos` },
  };
}

export const ld = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
