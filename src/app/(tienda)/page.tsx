import { ArrowRight, BadgeCheck, CalendarCheck, Camera, CreditCard, MapPin, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";
import { BranchMap } from "@/components/BranchMap";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BestSellersRail, OffersRail, SocialPromos } from "@/components/home/Sections";
import { ProductArt } from "@/components/ProductArt";
import { WhatsAppIcon } from "@/components/icons";
import { branches, site } from "@/config/site";
import { categories, products } from "@/data/products";

export default function Home() {
  return (
    <>
      <HeroCarousel />

      {/* Beneficios */}
      <section className="mx-auto mt-6 max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {[
            { icon: Store, t: "Retiro en 8 sucursales", d: "Sin envíos, sin esperas" },
            { icon: CreditCard, t: "Pagá con Mercado Pago", d: "Tarjeta o dinero en cuenta" },
            { icon: CalendarCheck, t: "Reservá venta libre", d: "Pagás al retirar" },
            { icon: WhatsAppIcon, t: "Confirmación por WhatsApp", d: "Directo con tu farmacia" },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex items-center gap-3 rounded-2xl bg-surface p-3 md:p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-[13px] font-bold md:text-sm">{t}</span>
                <span className="block text-[11.5px] text-ink-mute md:text-xs">{d}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
        <h2 className="mb-5 font-display text-2xl font-extrabold md:text-3xl">Explorá por categoría</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {categories.map((c, i) => {
            const sample = products.filter((p) => p.category === c.key).sort((a, b) => b.popularity - a.popularity)[0];
            return (
              <Link
                key={c.key}
                href={`/productos?cat=${c.key}`}
                className={`card-hover group relative flex h-36 flex-col justify-between overflow-hidden rounded-3xl p-4 md:h-48 ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}
                style={{ background: c.color }}
              >
                <div className="relative z-10">
                  <p className="font-display text-lg font-extrabold leading-tight md:text-xl">{c.name}</p>
                  <p className="mt-0.5 text-[11.5px] font-semibold text-ink-soft">
                    {products.filter((p) => p.category === c.key).length} productos
                  </p>
                </div>
                <span
                  className={`relative z-10 w-fit rounded-full px-2 py-0.5 text-[10.5px] font-bold ${c.mode === "online" ? "bg-white text-[#0077B6]" : "bg-white text-accent-600"}`}
                >
                  {c.mode === "online" ? "Pago online" : "Reserva"}
                </span>
                <ProductArt
                  product={sample}
                  background={false}
                  className="absolute -bottom-3 -right-3 w-[58%] transition duration-500 group-hover:-rotate-6 group-hover:scale-110 md:w-[70%]"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <OffersRail />

      {/* Cómo funciona */}
      <section id="como-funciona" className="mx-auto mt-16 max-w-7xl scroll-mt-40 px-4 md:px-6">
        <div className="rounded-[32px] bg-brand-50 p-6 md:p-12">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">Así de simple</p>
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">Asegurá tu compra en 3 pasos</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { n: "1", icon: MapPin, t: "Elegí tu farmacia", d: "La más cerca de tu casa o de tu trabajo. Hay 8 en Berazategui, una abierta las 24 hs." },
              { n: "2", icon: ShieldCheck, t: "Pagá o reservá", d: "Perfumería, dermo, bebés y cuidado personal: pagás online con Mercado Pago. Venta libre: reservás y pagás en el local." },
              { n: "3", icon: BadgeCheck, t: "Retirá con tu código", d: "Te llega la confirmación por WhatsApp con tu código y QR. Mostralo en el mostrador y listo." },
            ].map(({ n, icon: Icon, t, d }) => (
              <div key={n} className="relative rounded-3xl bg-white p-6 shadow-sm">
                <span className="absolute right-5 top-3 font-display text-6xl font-extrabold text-brand-100">{n}</span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-extrabold">{t}</h3>
                <p className="mt-1 text-sm text-ink-soft">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-mute">
            Todos los productos están sujetos a disponibilidad en la sucursal elegida. Si algo falta, tu farmacia te avisa por WhatsApp.
          </p>
        </div>
      </section>

      <BestSellersRail />

      {/* Receta */}
      <section className="mx-auto mt-16 max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-6 overflow-hidden rounded-[32px] border border-line bg-white p-6 md:grid-cols-2 md:p-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-bold text-accent-600">
              <Camera className="h-3.5 w-3.5" /> Consulta con receta
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-4xl">
              ¿Tenés una receta? Sacale una foto.
            </h2>
            <p className="mt-2 text-ink-soft">
              Subila, elegí tu farmacia y te respondemos por WhatsApp con disponibilidad y precio con tu obra social. Es una consulta:
              la dispensa se hace en el mostrador, como siempre.
            </p>
            <Link href="/receta" className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition hover:gap-3">
              Consultar con mi receta <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
            <div className="absolute left-[8%] top-[6%] w-[58%] rotate-[-6deg] rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-line">
              <div className="mb-2 h-2 w-16 rounded bg-brand-200" />
              <div className="space-y-1.5">
                {[90, 70, 80, 55, 65].map((w, i) => (
                  <div key={i} className="h-1.5 rounded bg-surface" style={{ width: `${w}%` }} />
                ))}
              </div>
              <p className="mt-3 font-display text-lg italic text-brand-700">Rp/</p>
              <div className="mt-1 h-1.5 w-3/4 rounded bg-ink/15" />
              <div className="mt-1.5 h-1.5 w-1/2 rounded bg-ink/15" />
              <div className="ml-auto mt-4 h-6 w-20 rounded-full border-2 border-dashed border-ink/15" />
            </div>
            <div className="absolute bottom-[4%] right-[4%] w-[62%] animate-fade-up rounded-2xl bg-[#E7FFDB] p-3 shadow-xl [animation-delay:.3s]">
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#128C7E]">
                <WhatsAppIcon className="h-3.5 w-3.5" /> {site.name} Centro
              </p>
              <p className="mt-1 text-[13px] leading-snug">
                ¡Hola! Tenemos tu medicación 💊 Con tu obra social queda en $8.450. Te la separamos hasta las 20 h 🙌
              </p>
            </div>
          </div>
        </div>
      </section>

      <SocialPromos />

      {/* Sucursales */}
      <section className="mx-auto mt-16 max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand">La red</p>
            <h2 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">
              {branches.length} farmacias de barrio. Un mismo catálogo.
            </h2>
            <p className="mt-2 text-ink-soft">
              Desde Villa España hasta Gutiérrez: elegí la que te quede cómoda y retirá en el horario que te sirva.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {branches.map((b) => (
                <Link key={b.slug} href={`/sucursales/${b.slug}`} className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold transition hover:border-brand hover:text-brand">
                  {b.name}
                </Link>
              ))}
            </div>
            <Link href="/sucursales" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition hover:gap-3">
              Ver sucursales y horarios <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <BranchMap />
        </div>
      </section>
    </>
  );
}
