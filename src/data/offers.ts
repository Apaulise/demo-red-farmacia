import type { CategoryKey } from "./products";

export type OfferKind = "porcentaje" | "segunda";
export type OfferTheme = "brand" | "accent" | "violet" | "sun" | "sky";

export type Offer = {
  id: string;
  title: string;
  subtitle: string;
  /** porcentaje = X% off · segunda = 2da unidad al X% off */
  kind: OfferKind;
  value: number;
  target:
    | { type: "categoria"; value: CategoryKey }
    | { type: "productos"; value: string[] };
  active: boolean;
  /** Aparece en el carrusel principal del inicio */
  featured: boolean;
  theme: OfferTheme;
  validUntil: string;
};

export const seedOffers: Offer[] = [
  {
    id: "of-solares",
    title: "Semana del sol",
    subtitle: "25% off en protectores solares seleccionados",
    kind: "porcentaje",
    value: 25,
    target: { type: "productos", value: ["p01", "p02", "p40"] },
    active: true,
    featured: true,
    theme: "sun",
    validUntil: "Hasta el domingo",
  },
  {
    id: "of-panales",
    title: "Pañales 2da al 50%",
    subtitle: "Llevá dos paquetes y el segundo sale la mitad",
    kind: "segunda",
    value: 50,
    target: { type: "productos", value: ["p33", "p34"] },
    active: true,
    featured: true,
    theme: "sky",
    validUntil: "Todo noviembre",
  },
  {
    id: "of-dermo",
    title: "Rutina facial",
    subtitle: "20% off en sérums y cremas faciales",
    kind: "porcentaje",
    value: 20,
    target: { type: "productos", value: ["p03", "p04", "p07", "p08"] },
    active: true,
    featured: true,
    theme: "violet",
    validUntil: "Hasta el 30/11",
  },
  {
    id: "of-perfumes",
    title: "Fragancias para regalar",
    subtitle: "15% off en perfumes y sets",
    kind: "porcentaje",
    value: 15,
    target: { type: "productos", value: ["p11", "p12", "p17"] },
    active: true,
    featured: false,
    theme: "accent",
    validUntil: "Hasta agotar stock",
  },
  {
    id: "of-cabello",
    title: "Cuidado del cabello",
    subtitle: "2da unidad al 70% en shampoo y acondicionador",
    kind: "segunda",
    value: 70,
    target: { type: "productos", value: ["p21", "p22", "p23"] },
    active: true,
    featured: false,
    theme: "brand",
    validUntil: "Hasta el domingo",
  },
];
