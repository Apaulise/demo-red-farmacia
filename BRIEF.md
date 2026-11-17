# Demo: plataforma para una red de farmacias independientes

Cliente potencial de Smokia (agencia de IA y software de Agustin Paulise). Es una red de 7 u 8
farmacias independientes de Berazategui (provincia de Buenos Aires) que quiere competir con las
cadenas grandes. Todavía no hay nombre ni marca, así que la demo es GENÉRICA: inventá un nombre
neutro de placeholder (por ejemplo "Red Farmacias" o similar) fácil de reemplazar desde un solo
archivo de configuración (nombre, logo, colores, sucursales).

Objetivo: una demo FUNCIONAL, muy visual e impactante, para grabar un video de Loom de 3 a 5 minutos
que acompaña la propuesta comercial. Tiene que verse como un producto real y terminado.

## Qué piden (requisitos del cliente)
- Referencias de inspiración (no copiar): Farmaexpert, FarmaPlus y Farma Nobel.
- Una web común para toda la red con UN catálogo compartido (el mismo para todas las farmacias)
  de perfumería, cuidado personal, dermocosmética, bebés y medicamentos de venta libre, con
  ofertas y promos destacadas.
- La persona elige la farmacia más cercana (mapa o lista de 7-8 sucursales de Berazategui con
  dirección, horario y WhatsApp; usá direcciones ficticias pero creíbles de Berazategui).
- SOLO retiro en sucursal. No hay envíos a domicilio.
- "Asegurar la venta": pagar online y retirar. Por la normativa argentina (la venta online de
  medicamentos está suspendida judicialmente y COFA exige dispensar en farmacia habilitada):
  - Perfumería y cuidado personal: pago online con Mercado Pago (SIMULADO, sin cobro real) y retiro.
  - Venta libre: reserva online con pago en el local.
  - Mostrarlo claro en el carrito y el checkout, con la leyenda "sujeto a disponibilidad".
- Carga de receta: el cliente sube foto de la receta SOLO como consulta (no es compra); la
  farmacia elegida responde por WhatsApp.
- Confirmación de cada pedido/reserva por WhatsApp de la sucursal (botón wa.me con mensaje
  armado y código de pedido). No hay control de stock por sucursal.
- También quieren posicionamiento en Google y redes: sumá SEO básico (metadatos, schema de
  farmacia local por sucursal) y una sección o banners pensados para promos de redes.

## Lo que hace impactante la demo (sumalo)
- Panel de administración de la red: pedidos y reservas por sucursal con estados (nuevo,
  preparado, retirado), recetas recibidas, carga y edición de ofertas, y métricas que sirvan
  para hablar de ROI: pedidos por sucursal, reservas, ventas aseguradas online, clics a WhatsApp,
  productos más vistos, gráfico semanal. Datos de ejemplo realistas.
- Flujo completo que funcione de punta a punta en vivo: buscar, filtrar, agregar al carrito,
  elegir sucursal, pagar simulado o reservar, ver la confirmación con código y QR de retiro, y
  ver ese pedido aparecer en el panel.
- Mobile first (la mayoría va a entrar desde el celular) y que también se vea muy bien en
  desktop. Diseño moderno, limpio, con animaciones sutiles. Nada que parezca plantilla genérica.
- Productos de ejemplo con imágenes (generadas, placeholders lindos o fotos libres), nombres
  genéricos, sin logos de marcas reales. 40 a 60 productos.

## Reglas
- Stack sugerido: Next.js + TypeScript + Tailwind, datos locales o persistencia simple (por
  ejemplo localStorage o SQLite). Sin servicios pagos ni claves.
- No publiques, no hagas deploy ni push a ningún lado sin OK de Agustin. Todo queda local.
- Nada de datos reales de clientes ni claves en el código.
- Textos en español rioplatense ("elegí", "retirá").
- Verificá que compile y corra (npm run build y npm run dev) y recorré el flujo antes de dar
  por terminado.

## Entregables
1. La app corriendo con `npm run dev`.
2. README.md con cómo levantarla y cómo cambiar nombre, colores y sucursales.
3. LOOM_GUION.md: recorrido sugerido para el video de 3 a 5 minutos, paso por paso.
4. STATUS.md actualizado en cada etapa (plan listo, catálogo listo, checkout listo, panel listo,
   demo terminada).
5. Al terminar cada etapa avisale a Mr. Pou (asistente de Agustin) con una nota corta en español:
   `python3 -I ~/.claude/skills/grok-bridge/bridge.py note "..." --to mr-pou`
   (si el comando falla, seguí igual y dejalo anotado en STATUS.md).
