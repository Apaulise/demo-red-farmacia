import type { PurchaseMode } from "@/data/products";

export type OrderStatus = "nuevo" | "preparado" | "retirado" | "cancelado";

export type OrderItem = {
  id: string;
  name: string;
  qty: number;
  unit: number;
  total: number;
  mode: PurchaseMode;
};

export type Order = {
  code: string;
  createdAt: string;
  branch: string;
  customer: { name: string; phone: string };
  items: OrderItem[];
  onlineTotal: number;
  reservaTotal: number;
  /** true si la parte online se pagó con Mercado Pago (simulado) */
  paid: boolean;
  paymentMethod?: "mp-tarjeta" | "mp-dinero" | null;
  status: OrderStatus;
  channel: "web" | "instagram" | "whatsapp" | "google";
  /** Creado en vivo durante la demo */
  live?: boolean;
  updatedAt?: string;
};

export type RxStatus = "pendiente" | "respondida";

export type Prescription = {
  id: string;
  createdAt: string;
  branch: string;
  name: string;
  phone: string;
  note: string;
  /** dataURL de la foto o "sample:N" para recetas de ejemplo */
  image: string;
  status: RxStatus;
  live?: boolean;
};

export type Stats = {
  views: Record<string, number>;
  waClicks: number;
  waByBranch: Record<string, number>;
};
