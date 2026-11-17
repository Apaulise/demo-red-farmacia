/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN DE MARCA — editá SOLO este archivo para cambiar
 *  nombre, logo, colores, redes y sucursales de toda la demo.
 * ─────────────────────────────────────────────────────────────
 */

export type Branch = {
  slug: string;
  name: string;
  /** Dirección ficticia */
  address: string;
  neighborhood: string;
  /** Horario legible */
  hours: string;
  /** Horario estructurado para schema.org (Mo-Fr 08:00-21:00) */
  openingHours: string[];
  /** Número en formato internacional sin "+" ni espacios (ficticio) */
  whatsapp: string;
  phone: string;
  /** Posición en el mapa estilizado (0-100) */
  map: { x: number; y: number };
  /** Coordenadas aproximadas (ficticias) para schema.org */
  geo: { lat: number; lng: number };
  pharmacist: string;
  open24?: boolean;
};

export const site = {
  /** Nombre de la red (placeholder neutro) */
  name: "Red Farmacias",
  /** Nombre corto para el logo */
  shortName: "Red",
  tagline: "Tu farmacia de barrio, con la fuerza de una red.",
  city: "Berazategui",
  region: "Buenos Aires",
  /** URL pública (solo se usa para SEO/sitemap; podés dejarla así en la demo) */
  url: "https://redfarmacias.example",
  /**
   * Logo: si ponés una ruta (ej. "/logo.svg" dentro de /public) se usa la imagen.
   * Si queda vacío, se dibuja el isotipo por defecto con la inicial.
   */
  logo: "",
  colors: {
    /** Color principal de la marca */
    brand: "#0B7A64",
    /** Acento para ofertas y llamados a la acción */
    accent: "#FF5A3C",
    /** Color de texto principal */
    ink: "#0C1F1B",
  },
  social: {
    instagram: "@redfarmacias",
    facebook: "Red Farmacias",
    tiktok: "@redfarmacias",
  },
  /** Moneda y país */
  locale: "es-AR",
  currency: "ARS",
} as const;

/** Sucursales (direcciones y teléfonos FICTICIOS para la demo) */
export const branches: Branch[] = [
  {
    slug: "centro",
    name: "Berazategui Centro",
    address: "Av. 14 N° 4820, esq. 148",
    neighborhood: "Centro",
    hours: "Lun a Sáb 8 a 22 · Dom 9 a 14",
    openingHours: ["Mo-Sa 08:00-22:00", "Su 09:00-14:00"],
    whatsapp: "5491155550101",
    phone: "(011) 4256-0101",
    map: { x: 52, y: 47 },
    geo: { lat: -34.7642, lng: -58.2121 },
    pharmacist: "Farm. Laura Giménez",
  },
  {
    slug: "plaza-mitre",
    name: "Plaza Mitre",
    address: "Av. Mitre 1950, esq. 13",
    neighborhood: "Berazategui Este",
    hours: "Abierta las 24 horas",
    openingHours: ["Mo-Su 00:00-23:59"],
    whatsapp: "5491155550102",
    phone: "(011) 4256-0102",
    map: { x: 63, y: 36 },
    geo: { lat: -34.7581, lng: -58.2027 },
    pharmacist: "Farm. Martín Duarte",
    open24: true,
  },
  {
    slug: "ranelagh",
    name: "Ranelagh",
    address: "Av. Lisandro de la Torre 1325",
    neighborhood: "Ranelagh",
    hours: "Lun a Vie 8 a 21 · Sáb 8 a 14",
    openingHours: ["Mo-Fr 08:00-21:00", "Sa 08:00-14:00"],
    whatsapp: "5491155550103",
    phone: "(011) 4258-0103",
    map: { x: 26, y: 58 },
    geo: { lat: -34.7905, lng: -58.2004 },
    pharmacist: "Farm. Sofía Peralta",
  },
  {
    slug: "hudson",
    name: "Hudson",
    address: "Calle 63 N° 1180, esq. 159",
    neighborhood: "Guillermo E. Hudson",
    hours: "Lun a Sáb 8 a 21",
    openingHours: ["Mo-Sa 08:00-21:00"],
    whatsapp: "5491155550104",
    phone: "(011) 4215-0104",
    map: { x: 80, y: 66 },
    geo: { lat: -34.7905, lng: -58.1488 },
    pharmacist: "Farm. Diego Ferreyra",
  },
  {
    slug: "platanos",
    name: "Plátanos",
    address: "Av. Calchaquí 3740",
    neighborhood: "Plátanos",
    hours: "Lun a Sáb 8:30 a 21",
    openingHours: ["Mo-Sa 08:30-21:00"],
    whatsapp: "5491155550105",
    phone: "(011) 4216-0105",
    map: { x: 70, y: 52 },
    geo: { lat: -34.7766, lng: -58.1702 },
    pharmacist: "Farm. Carolina Ruiz",
  },
  {
    slug: "sourigues",
    name: "Sourigues",
    address: "Av. Milazzo 2260, esq. 30",
    neighborhood: "Sourigues",
    hours: "Lun a Vie 8 a 20 · Sáb 9 a 13",
    openingHours: ["Mo-Fr 08:00-20:00", "Sa 09:00-13:00"],
    whatsapp: "5491155550106",
    phone: "(011) 4226-0106",
    map: { x: 33, y: 74 },
    geo: { lat: -34.8012, lng: -58.2178 },
    pharmacist: "Farm. Nicolás Acosta",
  },
  {
    slug: "villa-espana",
    name: "Villa España",
    address: "Calle 10 N° 2675, esq. 115",
    neighborhood: "Villa España",
    hours: "Lun a Sáb 8 a 21:30",
    openingHours: ["Mo-Sa 08:00-21:30"],
    whatsapp: "5491155550107",
    phone: "(011) 4256-0107",
    map: { x: 40, y: 30 },
    geo: { lat: -34.7559, lng: -58.2237 },
    pharmacist: "Farm. Valeria Sosa",
  },
  {
    slug: "gutierrez",
    name: "J. M. Gutiérrez",
    address: "Av. Gral. Belgrano 4410",
    neighborhood: "Juan María Gutiérrez",
    hours: "Lun a Sáb 8 a 20:30",
    openingHours: ["Mo-Sa 08:00-20:30"],
    whatsapp: "5491155550108",
    phone: "(011) 4229-0108",
    map: { x: 16, y: 82 },
    geo: { lat: -34.8301, lng: -58.2052 },
    pharmacist: "Farm. Julián Medina",
  },
];

export function getBranch(slug?: string | null) {
  return branches.find((b) => b.slug === slug);
}
