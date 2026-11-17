import { getBranch, site } from "@/config/site";
import { ars } from "./format";
import { makeCode } from "./seed";
import type { CartLine } from "./pricing";
import type { Order } from "./types";

export function buildOrder(opts: {
  lines: CartLine[];
  branch: string;
  name: string;
  phone: string;
  paymentMethod: Order["paymentMethod"];
  existingCodes: Set<string>;
}): Order {
  let code = makeCode();
  while (opts.existingCodes.has(code)) code = makeCode();
  const items = opts.lines.map((l) => ({
    id: l.product.id,
    name: l.product.name,
    qty: l.qty,
    unit: l.unit,
    total: l.total,
    mode: l.mode,
  }));
  const onlineTotal = items.filter((i) => i.mode === "online").reduce((a, i) => a + i.total, 0);
  const reservaTotal = items.filter((i) => i.mode === "reserva").reduce((a, i) => a + i.total, 0);
  return {
    code,
    createdAt: new Date().toISOString(),
    branch: opts.branch,
    customer: { name: opts.name.trim(), phone: opts.phone.trim() },
    items,
    onlineTotal,
    reservaTotal,
    paid: onlineTotal > 0,
    paymentMethod: onlineTotal > 0 ? opts.paymentMethod : null,
    status: "nuevo",
    channel: "web",
    live: true,
  };
}

export function orderKind(o: Pick<Order, "onlineTotal" | "reservaTotal">) {
  if (o.onlineTotal > 0 && o.reservaTotal > 0) return "mixto" as const;
  return o.onlineTotal > 0 ? ("pedido" as const) : ("reserva" as const);
}

/** Mensaje que el cliente envía a la sucursal para confirmar su pedido */
export function customerWhatsAppMessage(o: Order) {
  const b = getBranch(o.branch);
  const online = o.items.filter((i) => i.mode === "online");
  const reserva = o.items.filter((i) => i.mode === "reserva");
  const lines = [
    `¡Hola ${site.name} ${b?.name}! 👋`,
    `Soy ${o.customer.name}. Hice el pedido *${o.code}* para retirar en la sucursal.`,
    "",
  ];
  if (online.length) {
    lines.push(`✅ *Pagado online con Mercado Pago (${ars(o.onlineTotal)}):*`);
    online.forEach((i) => lines.push(`• ${i.qty} x ${i.name}`));
    lines.push("");
  }
  if (reserva.length) {
    lines.push(`🗓️ *Reserva para pagar en el local (${ars(o.reservaTotal)}):*`);
    reserva.forEach((i) => lines.push(`• ${i.qty} x ${i.name}`));
    lines.push("");
  }
  lines.push("¿Me avisan cuando esté listo para retirar? ¡Gracias!");
  return lines.join("\n");
}

/** Mensaje que la farmacia envía al cliente cuando el pedido está listo */
export function readyWhatsAppMessage(o: Order) {
  const b = getBranch(o.branch);
  const first = o.customer.name.split(" ")[0];
  return [
    `¡Hola ${first}! Tu pedido *${o.code}* ya está listo para retirar en ${site.name} ${b?.name} 🎉`,
    `📍 ${b?.address}`,
    `🕐 ${b?.hours}`,
    o.reservaTotal > 0 ? `💳 Recordá que la reserva (${ars(o.reservaTotal)}) se abona al retirar.` : "✅ Ya está pago, solo mostrá tu código.",
    "¡Te esperamos!",
  ].join("\n");
}
