export type CategoryKey =
  | "dermocosmetica"
  | "perfumeria"
  | "cuidado-personal"
  | "bebes"
  | "venta-libre";

/** online = pago online con Mercado Pago y retiro · reserva = se paga en el local */
export type PurchaseMode = "online" | "reserva";

export type Shape =
  | "bottle"
  | "pump"
  | "tube"
  | "jar"
  | "dropper"
  | "spray"
  | "perfume"
  | "box"
  | "blister"
  | "diaper"
  | "babybottle"
  | "stick"
  | "wipes"
  | "soap";

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Texto corto que aparece en la ilustración */
  label: string;
  category: CategoryKey;
  sub: string;
  price: number;
  size: string;
  description: string;
  highlights: string[];
  art: { shape: Shape; color: string; tint: string };
  /** Puntaje base de popularidad (para "más vistos") */
  popularity: number;
  isNew?: boolean;
};

export const categories: {
  key: CategoryKey;
  name: string;
  short: string;
  description: string;
  mode: PurchaseMode;
  color: string;
  emoji: string;
}[] = [
  {
    key: "dermocosmetica",
    name: "Dermocosmética",
    short: "Dermo",
    description: "Cuidado facial, solares y tratamientos recomendados por especialistas.",
    mode: "online",
    color: "#E9F3F0",
    emoji: "✨",
  },
  {
    key: "perfumeria",
    name: "Perfumería",
    short: "Perfumería",
    description: "Fragancias, maquillaje y regalos.",
    mode: "online",
    color: "#F6EEF6",
    emoji: "🌸",
  },
  {
    key: "cuidado-personal",
    name: "Cuidado personal",
    short: "Cuidado",
    description: "Higiene, cabello, cuidado oral y corporal.",
    mode: "online",
    color: "#EEF3FB",
    emoji: "🧴",
  },
  {
    key: "bebes",
    name: "Bebés y mamás",
    short: "Bebés",
    description: "Pañales, higiene y cuidado para los más chicos.",
    mode: "online",
    color: "#FFF4E5",
    emoji: "🍼",
  },
  {
    key: "venta-libre",
    name: "Venta libre",
    short: "Venta libre",
    description: "Medicamentos de venta libre. Se reservan online y se pagan en la farmacia.",
    mode: "reserva",
    color: "#FDEEEA",
    emoji: "💊",
  },
];

export function getCategory(key: CategoryKey) {
  return categories.find((c) => c.key === key)!;
}

export function modeFor(category: CategoryKey): PurchaseMode {
  return getCategory(category).mode;
}

type Seed = Omit<Product, "id" | "slug">;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const seeds: Seed[] = [
  // ───────── DERMOCOSMÉTICA ─────────
  {
    name: "Protector solar facial FPS 50 toque seco",
    label: "SOLAR 50",
    category: "dermocosmetica",
    sub: "Solares",
    price: 28900,
    size: "50 ml",
    description:
      "Fluido ultraliviano de absorción inmediata. Alta protección UVA/UVB, sin perfume, ideal para piel mixta a grasa y para usar debajo del maquillaje.",
    highlights: ["Alta protección UVA/UVB", "Acabado mate", "Testeado dermatológicamente"],
    art: { shape: "tube", color: "#F2A541", tint: "#FFF3DF" },
    popularity: 98,
  },
  {
    name: "Protector solar corporal FPS 30 spray",
    label: "SOLAR 30",
    category: "dermocosmetica",
    sub: "Solares",
    price: 24500,
    size: "200 ml",
    description:
      "Spray de aplicación fácil y pareja. Resistente al agua y al sudor, con vitamina E.",
    highlights: ["Resistente al agua", "Con vitamina E", "Aplicación 360°"],
    art: { shape: "spray", color: "#F28C38", tint: "#FFEEDD" },
    popularity: 81,
  },
  {
    name: "Sérum facial ácido hialurónico + niacinamida",
    label: "SÉRUM HA",
    category: "dermocosmetica",
    sub: "Facial",
    price: 32400,
    size: "30 ml",
    description:
      "Hidratación profunda y textura más uniforme. Fórmula ligera con ácido hialurónico de doble peso molecular y niacinamida al 5%.",
    highlights: ["Hidratación 24 h", "Niacinamida 5%", "Apto piel sensible"],
    art: { shape: "dropper", color: "#5B8DEF", tint: "#E9F0FE" },
    popularity: 95,
    isNew: true,
  },
  {
    name: "Crema hidratante facial piel seca",
    label: "HIDRA",
    category: "dermocosmetica",
    sub: "Facial",
    price: 21800,
    size: "50 g",
    description:
      "Crema nutritiva con ceramidas y manteca de karité que restaura la barrera de la piel.",
    highlights: ["Con ceramidas", "Sin parabenos", "Uso día y noche"],
    art: { shape: "jar", color: "#3BA88F", tint: "#E3F5F0" },
    popularity: 77,
  },
  {
    name: "Gel limpiador facial piel grasa",
    label: "CLEAN",
    category: "dermocosmetica",
    sub: "Limpieza",
    price: 16900,
    size: "200 ml",
    description:
      "Limpia en profundidad sin resecar. Con ácido salicílico y zinc para controlar el brillo.",
    highlights: ["Ácido salicílico", "Controla el brillo", "pH balanceado"],
    art: { shape: "pump", color: "#2BB3C0", tint: "#E0F6F8" },
    popularity: 72,
  },
  {
    name: "Agua micelar 3 en 1",
    label: "MICELAR",
    category: "dermocosmetica",
    sub: "Limpieza",
    price: 13900,
    size: "400 ml",
    description: "Desmaquilla, limpia y tonifica en un solo paso. Sin enjuague.",
    highlights: ["Sin enjuague", "Para ojos y rostro", "Sin alcohol"],
    art: { shape: "bottle", color: "#E57AA8", tint: "#FCEAF2" },
    popularity: 84,
  },
  {
    name: "Contorno de ojos antiojeras",
    label: "OJOS",
    category: "dermocosmetica",
    sub: "Facial",
    price: 26700,
    size: "15 ml",
    description: "Reduce bolsas y ojeras con cafeína y péptidos. Aplicador frío metálico.",
    highlights: ["Con cafeína", "Aplicador frío", "Resultados en 4 semanas"],
    art: { shape: "tube", color: "#8B6FD6", tint: "#F0EBFB" },
    popularity: 63,
  },
  {
    name: "Sérum vitamina C 10% iluminador",
    label: "VIT C",
    category: "dermocosmetica",
    sub: "Facial",
    price: 34900,
    size: "30 ml",
    description: "Unifica el tono y aporta luminosidad. Vitamina C estabilizada + vitamina E.",
    highlights: ["Antioxidante", "Ilumina", "Uso diurno"],
    art: { shape: "dropper", color: "#F0A202", tint: "#FFF5DA" },
    popularity: 88,
  },
  {
    name: "Crema reparadora manos y pies",
    label: "REPARA",
    category: "dermocosmetica",
    sub: "Corporal",
    price: 11200,
    size: "75 ml",
    description: "Urea al 10% para pieles muy secas o agrietadas. Absorción rápida.",
    highlights: ["Urea 10%", "No engrasa", "Sin perfume"],
    art: { shape: "tube", color: "#4FA36B", tint: "#E6F4EA" },
    popularity: 55,
  },
  {
    name: "Bálsamo labial reparador FPS 15",
    label: "LABIAL",
    category: "dermocosmetica",
    sub: "Labios",
    price: 6900,
    size: "4 g",
    description: "Repara y protege labios secos. Con manteca de cacao y FPS 15.",
    highlights: ["FPS 15", "Manteca de cacao", "Larga duración"],
    art: { shape: "stick", color: "#E0607E", tint: "#FCE8EC" },
    popularity: 60,
  },
  // ───────── PERFUMERÍA ─────────
  {
    name: "Eau de parfum floral frutal",
    label: "FLORA",
    category: "perfumeria",
    sub: "Fragancias",
    price: 45900,
    size: "100 ml",
    description: "Notas de salida de pera y bergamota, corazón de jazmín y fondo de vainilla.",
    highlights: ["Larga duración", "Notas florales", "Ideal para regalar"],
    art: { shape: "perfume", color: "#E58BB3", tint: "#FCEDF4" },
    popularity: 90,
  },
  {
    name: "Eau de toilette cítrica masculina",
    label: "CITRUS",
    category: "perfumeria",
    sub: "Fragancias",
    price: 39800,
    size: "100 ml",
    description: "Fresca y energizante: limón, jengibre y cedro.",
    highlights: ["Fresca", "Uso diario", "Frasco recargable"],
    art: { shape: "perfume", color: "#3A7CA5", tint: "#E5F0F7" },
    popularity: 79,
  },
  {
    name: "Body splash vainilla y coco",
    label: "SPLASH",
    category: "perfumeria",
    sub: "Fragancias",
    price: 15900,
    size: "250 ml",
    description: "Bruma corporal suave y dulce para todos los días.",
    highlights: ["Aroma suave", "Hidrata", "Formato grande"],
    art: { shape: "spray", color: "#D9A066", tint: "#FBF0E3" },
    popularity: 71,
  },
  {
    name: "Base de maquillaje líquida cobertura media",
    label: "BASE",
    category: "perfumeria",
    sub: "Maquillaje",
    price: 22600,
    size: "30 ml",
    description: "Acabado natural y luminoso, con FPS 20. Disponible en 8 tonos.",
    highlights: ["FPS 20", "Larga duración", "8 tonos"],
    art: { shape: "pump", color: "#C8936B", tint: "#F8EDE4" },
    popularity: 66,
  },
  {
    name: "Máscara de pestañas volumen extremo",
    label: "MÁSCARA",
    category: "perfumeria",
    sub: "Maquillaje",
    price: 14300,
    size: "10 ml",
    description: "Volumen y definición sin grumos. Resistente al agua.",
    highlights: ["Waterproof", "Sin grumos", "Cepillo curvo"],
    art: { shape: "stick", color: "#2E2A3B", tint: "#ECEAF2" },
    popularity: 68,
  },
  {
    name: "Esmalte de uñas secado rápido",
    label: "NAILS",
    category: "perfumeria",
    sub: "Maquillaje",
    price: 5400,
    size: "10 ml",
    description: "Color intenso en una sola capa, seca en 60 segundos.",
    highlights: ["Secado rápido", "Brillo gel", "12 colores"],
    art: { shape: "perfume", color: "#D7263D", tint: "#FBE6E8" },
    popularity: 52,
  },
  {
    name: "Set de regalo crema + colonia",
    label: "GIFT SET",
    category: "perfumeria",
    sub: "Regalos",
    price: 34500,
    size: "2 productos",
    description: "Colonia 80 ml + crema corporal 200 ml en estuche de regalo.",
    highlights: ["Estuche de regalo", "2 productos", "Edición limitada"],
    art: { shape: "box", color: "#B565A7", tint: "#F6EAF4" },
    popularity: 74,
    isNew: true,
  },
  {
    name: "Desodorante en aerosol 48 h",
    label: "DEO 48H",
    category: "perfumeria",
    sub: "Desodorantes",
    price: 4900,
    size: "150 ml",
    description: "Protección antitranspirante 48 horas, sin manchas.",
    highlights: ["48 h", "Sin manchas", "Fragancia fresca"],
    art: { shape: "spray", color: "#4A6FA5", tint: "#E8EEF7" },
    popularity: 86,
  },
  {
    name: "Desodorante roll-on sin alcohol",
    label: "ROLL-ON",
    category: "perfumeria",
    sub: "Desodorantes",
    price: 4200,
    size: "50 ml",
    description: "Suave con la piel, ideal después de la depilación.",
    highlights: ["Sin alcohol", "Piel sensible", "Aloe vera"],
    art: { shape: "stick", color: "#6BBF9F", tint: "#E7F6F0" },
    popularity: 58,
  },
  {
    name: "Crema corporal perfumada almendras",
    label: "BODY",
    category: "perfumeria",
    sub: "Corporal",
    price: 9800,
    size: "400 ml",
    description: "Hidratación intensa con aceite de almendras y aroma delicado.",
    highlights: ["Aceite de almendras", "Formato familiar", "Absorción rápida"],
    art: { shape: "pump", color: "#E3B26B", tint: "#FBF2E3" },
    popularity: 64,
  },
  // ───────── CUIDADO PERSONAL ─────────
  {
    name: "Shampoo hidratación profunda",
    label: "SHAMPOO",
    category: "cuidado-personal",
    sub: "Cabello",
    price: 8900,
    size: "400 ml",
    description: "Para cabello seco y dañado. Con aceite de argán y pantenol.",
    highlights: ["Aceite de argán", "Sin sal", "Pantenol"],
    art: { shape: "bottle", color: "#2F9C95", tint: "#E2F4F2" },
    popularity: 83,
  },
  {
    name: "Acondicionador reparador puntas",
    label: "ACOND.",
    category: "cuidado-personal",
    sub: "Cabello",
    price: 8900,
    size: "400 ml",
    description: "Desenreda y sella las puntas abiertas. Complemento ideal del shampoo hidratación.",
    highlights: ["Sella puntas", "Desenreda", "Sin siliconas pesadas"],
    art: { shape: "bottle", color: "#7A5CC2", tint: "#EFEAF9" },
    popularity: 70,
  },
  {
    name: "Shampoo anticaspa uso frecuente",
    label: "ANTICASPA",
    category: "cuidado-personal",
    sub: "Cabello",
    price: 9600,
    size: "350 ml",
    description: "Controla la caspa desde el primer lavado, con piroctona olamina.",
    highlights: ["Desde el 1er lavado", "Uso diario", "Frescura mentolada"],
    art: { shape: "bottle", color: "#2C6E9B", tint: "#E5EFF6" },
    popularity: 61,
  },
  {
    name: "Pasta dental blanqueadora",
    label: "WHITE",
    category: "cuidado-personal",
    sub: "Cuidado oral",
    price: 4600,
    size: "90 g",
    description: "Remueve manchas y protege el esmalte, con flúor.",
    highlights: ["Con flúor", "Blanqueadora", "Aliento fresco"],
    art: { shape: "tube", color: "#1E88E5", tint: "#E3F0FC" },
    popularity: 78,
  },
  {
    name: "Cepillo dental suave pack x2",
    label: "CEPILLO",
    category: "cuidado-personal",
    sub: "Cuidado oral",
    price: 5900,
    size: "2 unidades",
    description: "Cerdas suaves de puntas redondeadas, mango ergonómico.",
    highlights: ["Cerdas suaves", "Pack x2", "Cabezal compacto"],
    art: { shape: "box", color: "#26A69A", tint: "#E0F3F1" },
    popularity: 50,
  },
  {
    name: "Enjuague bucal sin alcohol",
    label: "ENJUAGUE",
    category: "cuidado-personal",
    sub: "Cuidado oral",
    price: 7800,
    size: "500 ml",
    description: "Protección 24 h contra bacterias, sabor menta suave.",
    highlights: ["Sin alcohol", "24 h", "Menta suave"],
    art: { shape: "bottle", color: "#00A3A1", tint: "#DFF5F5" },
    popularity: 57,
  },
  {
    name: "Jabón líquido de manos antibacterial",
    label: "JABÓN",
    category: "cuidado-personal",
    sub: "Higiene",
    price: 4900,
    size: "250 ml",
    description: "Elimina el 99,9% de las bacterias, con glicerina.",
    highlights: ["Antibacterial", "Con glicerina", "Dosificador"],
    art: { shape: "pump", color: "#43A047", tint: "#E5F4E6" },
    popularity: 66,
  },
  {
    name: "Alcohol en gel 70%",
    label: "GEL 70%",
    category: "cuidado-personal",
    sub: "Higiene",
    price: 3900,
    size: "250 ml",
    description: "Higiene de manos sin agua, con aloe vera.",
    highlights: ["70% alcohol", "Con aloe", "Secado rápido"],
    art: { shape: "pump", color: "#29B6F6", tint: "#E1F4FD" },
    popularity: 54,
  },
  {
    name: "Jabón en barra neutro pack x3",
    label: "NEUTRO",
    category: "cuidado-personal",
    sub: "Higiene",
    price: 4500,
    size: "3 x 90 g",
    description: "pH neutro, para toda la familia.",
    highlights: ["pH neutro", "Pack x3", "Hipoalergénico"],
    art: { shape: "soap", color: "#8FBC8F", tint: "#EDF5ED" },
    popularity: 47,
  },
  {
    name: "Toallitas desmaquillantes x25",
    label: "TOALLITAS",
    category: "cuidado-personal",
    sub: "Higiene",
    price: 3600,
    size: "25 unidades",
    description: "Remueven el maquillaje y la suciedad, con agua micelar.",
    highlights: ["Con micelar", "Biodegradables", "Ojos y rostro"],
    art: { shape: "wipes", color: "#EC6F9A", tint: "#FCE9F0" },
    popularity: 59,
  },
  {
    name: "Termómetro digital flexible",
    label: "TERMO",
    category: "cuidado-personal",
    sub: "Botiquín",
    price: 8400,
    size: "1 unidad",
    description: "Lectura en 10 segundos, punta flexible y alarma de fiebre.",
    highlights: ["10 segundos", "Punta flexible", "Memoria"],
    art: { shape: "stick", color: "#3F51B5", tint: "#E8EAF6" },
    popularity: 62,
  },
  {
    name: "Curitas surtidas x40",
    label: "CURITAS",
    category: "cuidado-personal",
    sub: "Botiquín",
    price: 3200,
    size: "40 unidades",
    description: "Apósitos adhesivos en distintos tamaños, resistentes al agua.",
    highlights: ["Surtidas", "Resistentes al agua", "Hipoalergénicas"],
    art: { shape: "box", color: "#F57C52", tint: "#FDEDE6" },
    popularity: 44,
  },
  // ───────── BEBÉS ─────────
  {
    name: "Pañales ultra absorción talle G x40",
    label: "PAÑALES G",
    category: "bebes",
    sub: "Pañales",
    price: 26900,
    size: "40 unidades",
    description: "Hasta 12 horas secos, cintura elastizada y tela suave.",
    highlights: ["12 h secos", "Indicador de humedad", "Hipoalergénicos"],
    art: { shape: "diaper", color: "#4FC3F7", tint: "#E3F6FE" },
    popularity: 97,
  },
  {
    name: "Pañales ultra absorción talle XG x36",
    label: "PAÑALES XG",
    category: "bebes",
    sub: "Pañales",
    price: 26900,
    size: "36 unidades",
    description: "Para bebés de 11 a 15 kg. Ajuste perfecto y máxima absorción.",
    highlights: ["11 a 15 kg", "Ajuste elástico", "Tela respirable"],
    art: { shape: "diaper", color: "#7986CB", tint: "#ECEEF8" },
    popularity: 85,
  },
  {
    name: "Toallitas húmedas bebé x80",
    label: "BABY WIPES",
    category: "bebes",
    sub: "Higiene",
    price: 4900,
    size: "80 unidades",
    description: "Sin alcohol ni perfume, con aloe vera y manzanilla.",
    highlights: ["Sin alcohol", "Sin perfume", "Aloe y manzanilla"],
    art: { shape: "wipes", color: "#81C784", tint: "#EAF6EA" },
    popularity: 80,
  },
  {
    name: "Crema para cocheduras con óxido de zinc",
    label: "COCHEDURAS",
    category: "bebes",
    sub: "Cuidado",
    price: 8700,
    size: "60 g",
    description: "Previene y alivia la dermatitis del pañal desde el primer uso.",
    highlights: ["Óxido de zinc", "Pediatras recomiendan", "Sin perfume"],
    art: { shape: "tube", color: "#FFB74D", tint: "#FFF4E3" },
    popularity: 73,
  },
  {
    name: "Shampoo bebé sin lágrimas",
    label: "BABY",
    category: "bebes",
    sub: "Higiene",
    price: 6800,
    size: "400 ml",
    description: "Fórmula suave que no irrita los ojos, con extracto de manzanilla.",
    highlights: ["Sin lágrimas", "pH balanceado", "Manzanilla"],
    art: { shape: "bottle", color: "#FFD54F", tint: "#FFF8DD" },
    popularity: 65,
  },
  {
    name: "Mamadera anticólicos 260 ml",
    label: "MAMADERA",
    category: "bebes",
    sub: "Alimentación",
    price: 12900,
    size: "260 ml",
    description: "Válvula anticólicos y tetina de silicona símil pecho. Libre de BPA.",
    highlights: ["Libre de BPA", "Anticólicos", "Tetina 0-6 m"],
    art: { shape: "babybottle", color: "#F48FB1", tint: "#FDEBF2" },
    popularity: 69,
  },
  {
    name: "Aceite humectante bebé",
    label: "ACEITE",
    category: "bebes",
    sub: "Cuidado",
    price: 7400,
    size: "200 ml",
    description: "Ideal para masajes después del baño, hidrata y protege.",
    highlights: ["Hipoalergénico", "Para masajes", "Aroma suave"],
    art: { shape: "bottle", color: "#BA68C8", tint: "#F5EAF8" },
    popularity: 49,
  },
  {
    name: "Protector solar pediátrico FPS 50",
    label: "KIDS 50",
    category: "bebes",
    sub: "Cuidado",
    price: 23900,
    size: "120 ml",
    description: "Para chicos desde los 6 meses. Resistente al agua y sin perfume.",
    highlights: ["Desde 6 meses", "Resistente al agua", "Muy alta protección"],
    art: { shape: "tube", color: "#4DB6AC", tint: "#E3F4F2" },
    popularity: 76,
    isNew: true,
  },
  {
    name: "Chupete de silicona 0-6 meses",
    label: "CHUPETE",
    category: "bebes",
    sub: "Accesorios",
    price: 6300,
    size: "1 unidad",
    description: "Tetina ortodóntica y escudo ventilado, con estuche higiénico.",
    highlights: ["Ortodóntico", "Con estuche", "Libre de BPA"],
    art: { shape: "box", color: "#90CAF9", tint: "#E9F3FD" },
    popularity: 46,
  },
  // ───────── VENTA LIBRE ─────────
  {
    name: "Ibuprofeno 400 mg x 20 comprimidos",
    label: "IBU 400",
    category: "venta-libre",
    sub: "Analgésicos",
    price: 4800,
    size: "20 comprimidos",
    description:
      "Analgésico y antiinflamatorio. Leer atentamente el prospecto y ante la menor duda consultar a su médico y/o farmacéutico.",
    highlights: ["Venta libre", "Dolor y fiebre", "Reserva online"],
    art: { shape: "blister", color: "#E53935", tint: "#FDE8E8" },
    popularity: 96,
  },
  {
    name: "Paracetamol 500 mg x 20 comprimidos",
    label: "PARA 500",
    category: "venta-libre",
    sub: "Analgésicos",
    price: 3600,
    size: "20 comprimidos",
    description:
      "Analgésico y antifebril. Leer atentamente el prospecto y ante la menor duda consultar a su médico y/o farmacéutico.",
    highlights: ["Venta libre", "Antifebril", "Reserva online"],
    art: { shape: "blister", color: "#1E88E5", tint: "#E3F0FC" },
    popularity: 91,
  },
  {
    name: "Antigripal día y noche x 12 sobres",
    label: "GRIPE",
    category: "venta-libre",
    sub: "Resfrío y gripe",
    price: 7900,
    size: "12 sobres",
    description:
      "Alivia los síntomas del resfrío. Leer atentamente el prospecto y ante la menor duda consultar a su médico y/o farmacéutico.",
    highlights: ["Día y noche", "Sabor limón", "Reserva online"],
    art: { shape: "box", color: "#FB8C00", tint: "#FFF0DE" },
    popularity: 75,
  },
  {
    name: "Pastillas para la garganta miel y limón x 16",
    label: "GARGANTA",
    category: "venta-libre",
    sub: "Resfrío y gripe",
    price: 3900,
    size: "16 pastillas",
    description:
      "Alivio del dolor de garganta. Leer atentamente el prospecto y ante la menor duda consultar a su médico y/o farmacéutico.",
    highlights: ["Miel y limón", "Alivio rápido", "Reserva online"],
    art: { shape: "blister", color: "#FDD835", tint: "#FFFAE0" },
    popularity: 67,
  },
  {
    name: "Antiácido masticable x 30 comprimidos",
    label: "ANTIÁCIDO",
    category: "venta-libre",
    sub: "Digestivos",
    price: 5200,
    size: "30 comprimidos",
    description:
      "Alivio de la acidez y la pesadez. Leer atentamente el prospecto y ante la menor duda consultar a su médico y/o farmacéutico.",
    highlights: ["Sabor menta", "Acción rápida", "Reserva online"],
    art: { shape: "box", color: "#43A047", tint: "#E5F4E6" },
    popularity: 58,
  },
  {
    name: "Loratadina 10 mg x 10 comprimidos",
    label: "ALERGIA",
    category: "venta-libre",
    sub: "Alergias",
    price: 4400,
    size: "10 comprimidos",
    description:
      "Antialérgico de acción prolongada. Leer atentamente el prospecto y ante la menor duda consultar a su médico y/o farmacéutico.",
    highlights: ["24 h", "No da sueño", "Reserva online"],
    art: { shape: "blister", color: "#8E24AA", tint: "#F3E5F5" },
    popularity: 70,
  },
  {
    name: "Vitamina C 1 g efervescente x 10",
    label: "VIT C 1G",
    category: "venta-libre",
    sub: "Vitaminas",
    price: 5600,
    size: "10 comprimidos",
    description:
      "Suplemento dietario de vitamina C sabor naranja. Consultar a su médico y/o farmacéutico.",
    highlights: ["Sabor naranja", "Efervescente", "Reserva online"],
    art: { shape: "box", color: "#F57C00", tint: "#FFF0DE" },
    popularity: 64,
  },
  {
    name: "Sales de rehidratación oral x 5 sobres",
    label: "SALES",
    category: "venta-libre",
    sub: "Digestivos",
    price: 3300,
    size: "5 sobres",
    description:
      "Reposición de líquidos y electrolitos. Leer atentamente el prospecto y ante la menor duda consultar a su médico y/o farmacéutico.",
    highlights: ["Sabor neutro", "Para toda la familia", "Reserva online"],
    art: { shape: "box", color: "#00ACC1", tint: "#DFF5F8" },
    popularity: 41,
  },
  {
    name: "Gel analgésico muscular",
    label: "MÚSCULO",
    category: "venta-libre",
    sub: "Analgésicos",
    price: 8100,
    size: "60 g",
    description:
      "Alivio local de dolores musculares y contracturas. Leer atentamente el prospecto y ante la menor duda consultar a su médico y/o farmacéutico.",
    highlights: ["Efecto frío", "Uso tópico", "Reserva online"],
    art: { shape: "tube", color: "#3949AB", tint: "#E8EAF6" },
    popularity: 60,
  },
  {
    name: "Descongestivo nasal en spray",
    label: "NASAL",
    category: "venta-libre",
    sub: "Resfrío y gripe",
    price: 6200,
    size: "15 ml",
    description:
      "Alivio de la congestión nasal. Leer atentamente el prospecto y ante la menor duda consultar a su médico y/o farmacéutico.",
    highlights: ["Acción rápida", "Hasta 12 h", "Reserva online"],
    art: { shape: "spray", color: "#039BE5", tint: "#E1F3FC" },
    popularity: 56,
  },
  {
    name: "Multivitamínico adultos x 30 comprimidos",
    label: "MULTI",
    category: "venta-libre",
    sub: "Vitaminas",
    price: 11900,
    size: "30 comprimidos",
    description:
      "Suplemento dietario con 12 vitaminas y minerales. Consultar a su médico y/o farmacéutico.",
    highlights: ["12 vitaminas", "1 por día", "Reserva online"],
    art: { shape: "jar", color: "#E65100", tint: "#FFEDE0" },
    popularity: 62,
  },
];

export const products: Product[] = seeds.map((s, i) => ({
  ...s,
  id: `p${String(i + 1).padStart(2, "0")}`,
  slug: slugify(s.name),
}));

export function getProduct(idOrSlug: string) {
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}
