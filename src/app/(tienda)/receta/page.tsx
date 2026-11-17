import type { Metadata } from "next";
import { RxForm } from "@/components/RxForm";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Consultá con tu receta",
  description: `Mandá la foto de tu receta a tu farmacia de ${site.name} en ${site.city} y te respondemos por WhatsApp con disponibilidad y precio.`,
  alternates: { canonical: "/receta" },
};

export default function RxPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 md:px-6 md:pt-8">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">Consulta con receta</p>
      <h1 className="font-display text-3xl font-extrabold md:text-5xl">Mandanos tu receta</h1>
      <p className="mb-6 mt-2 max-w-2xl text-ink-soft">
        Subí una foto, elegí tu farmacia y te respondemos por WhatsApp con disponibilidad y precio con tu cobertura. Sin vueltas.
      </p>
      <RxForm />
    </div>
  );
}
