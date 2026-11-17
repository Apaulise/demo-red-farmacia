import { BadgeCheck, CircleDot, PackageCheck, XCircle } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

const statusMap: Record<OrderStatus, { label: string; cls: string; icon: React.ElementType }> = {
  nuevo: { label: "Nuevo", cls: "bg-accent-100 text-accent-600", icon: CircleDot },
  preparado: { label: "Preparado", cls: "bg-[#FFF4D6] text-[#8A5A00]", icon: PackageCheck },
  retirado: { label: "Retirado", cls: "bg-brand-100 text-brand-700", icon: BadgeCheck },
  cancelado: { label: "Cancelado", cls: "bg-surface text-ink-mute", icon: XCircle },
};

export function StatusPill({ status }: { status: OrderStatus }) {
  const s = statusMap[status];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${s.cls}`}>
      <Icon className="h-3 w-3" /> {s.label}
    </span>
  );
}

export function KindChip({ kind }: { kind: "pedido" | "reserva" | "mixto" }) {
  const map = {
    pedido: { l: "Pagado online", c: "bg-mp/10 text-[#0077B6]" },
    reserva: { l: "Reserva", c: "bg-accent-50 text-accent-600" },
    mixto: { l: "Pago + reserva", c: "bg-[#EEE9FB] text-[#5B43D6]" },
  }[kind];
  return <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${map.c}`}>{map.l}</span>;
}
