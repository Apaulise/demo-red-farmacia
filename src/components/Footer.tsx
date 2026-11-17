import Link from "next/link";
import { branches, site } from "@/config/site";
import { categories } from "@/data/products";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./icons";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 bg-ink pb-24 text-white/75 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:px-6">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm">{site.tagline} Farmacias independientes de {site.city} unidas en un solo catálogo.</p>
          <div className="flex gap-2">
            {[InstagramIcon, FacebookIcon, TikTokIcon].map((Icon, i) => (
              <span key={i} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
                <Icon className="h-4.5 w-4.5" />
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Categorías</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.key}>
                <Link href={`/productos?cat=${c.key}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Ayuda</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#como-funciona" className="hover:text-white">Cómo comprar</Link></li>
            <li><Link href="/receta" className="hover:text-white">Consultar con receta</Link></li>
            <li><Link href="/sucursales" className="hover:text-white">Sucursales y horarios</Link></li>
            <li><Link href="/admin" className="hover:text-white">Acceso farmacias</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Sucursales</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {branches.map((b) => (
              <li key={b.slug}>
                <Link href={`/sucursales/${b.slug}`} className="hover:text-white">{b.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl space-y-2 px-4 py-6 text-xs text-white/50 md:px-6">
          <p>
            Solo retiro en sucursal. Productos sujetos a disponibilidad. Los medicamentos de venta libre se reservan online y se
            abonan y dispensan en la farmacia, de acuerdo con la normativa vigente. Leer atentamente los prospectos y ante la menor
            duda consultar a su médico y/o farmacéutico.
          </p>
          <p>© 2026 {site.name} · Demo de producto — datos y direcciones ficticias.</p>
        </div>
      </div>
    </footer>
  );
}
