import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { BranchPicker } from "@/components/BranchPicker";
import { Toaster } from "@/components/Toaster";
import { branches, site } from "@/config/site";
import "./globals.css";

const body = Plus_Jakarta_Sans({ variable: "--font-body", subsets: ["latin"] });
const display = Bricolage_Grotesque({ variable: "--font-display-face", subsets: ["latin"] });

const description = `${site.name}: ${branches.length} farmacias de ${site.city} en un solo catálogo. Dermocosmética, perfumería, cuidado personal, bebés y venta libre. Pagá online o reservá y retirá en tu sucursal.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Farmacias en ${site.city} con retiro en sucursal`,
    template: `%s · ${site.name}`,
  },
  description,
  keywords: [
    `farmacia ${site.city}`,
    `farmacia de turno ${site.city}`,
    "dermocosmética",
    "perfumería",
    "pañales",
    "retiro en sucursal",
    "venta libre",
  ],
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: site.name,
    title: `${site.name} · Comprá online y retirá en tu farmacia de ${site.city}`,
    description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: site.colors.brand,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    slogan: site.tagline,
    areaServed: `${site.city}, ${site.region}, Argentina`,
    department: branches.map((b) => ({
      "@type": "Pharmacy",
      name: `${site.name} ${b.name}`,
      url: `${site.url}/sucursales/${b.slug}`,
    })),
  };
  return (
    <html
      lang="es-AR"
      className={`${body.variable} ${display.variable} h-full antialiased`}
      style={
        {
          "--brand": site.colors.brand,
          "--accent": site.colors.accent,
          "--ink": site.colors.ink,
        } as React.CSSProperties
      }
    >
      <body className="flex min-h-full flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <BranchPicker />
        <Toaster />
      </body>
    </html>
  );
}
