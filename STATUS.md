# Estado — Demo Red Farmacias

**Etapa actual:** 5/5 — Demo terminada ✅

## Plan

Stack: Next.js (App Router) + TypeScript + Tailwind. Datos locales en `src/data/*` y persistencia
en `localStorage` (pedidos, recetas, ofertas, clics). Sin servicios pagos ni claves. Todo local.

Marca placeholder neutra: **"Red Farmacias"**, configurable desde un único archivo `src/config/site.ts` (nombre, slogan, logo, colores, sucursales).

### Etapas
1. **Plan** — este documento.
2. **Catálogo** — home (hero, promos destacadas, banners para redes, categorías), catálogo con
   búsqueda + filtros (categoría, precio, solo ofertas, orden), ficha de producto, 50 productos
   con imágenes SVG generadas (sin marcas reales), selector de sucursal (lista + mapa SVG
   estilizado de Berazategui, 8 sucursales ficticias con dirección, horario y WhatsApp).
3. **Checkout** — carrito que separa "Pago online (Mercado Pago simulado) + retiro" (perfumería,
   cuidado personal, dermo, bebés) de "Reserva con pago en el local" (venta libre), leyenda
   "sujeto a disponibilidad", elección de sucursal, pago simulado tipo MP, confirmación con código
   + QR de retiro + botón wa.me con mensaje armado. Carga de receta (foto como consulta → WhatsApp).
4. **Panel admin** (`/admin`) — métricas ROI (pedidos por sucursal, reservas, ventas aseguradas,
   clics a WhatsApp, más vistos, gráfico semanal), pedidos/reservas con estados
   (nuevo → preparado → retirado), recetas recibidas, ABM de ofertas. Datos semilla realistas +
   los pedidos hechos en vivo.
5. **Cierre** — SEO (metadata, Open Graph, JSON-LD `Pharmacy` por sucursal, sitemap, robots),
   README.md, LOOM_GUION.md, `npm run build` OK, recorrido del flujo completo en navegador.

### Reglas que respeto
- Nada de deploy, push ni publicación. Todo queda local.
- Sin datos reales de clientes ni claves. Direcciones ficticias.
- Textos en rioplatense.

## Bitácora
- Etapa 1: plan escrito. Nota a Mr. Pou enviada (inbox, id n-20261117-2154-c9e5).
- Etapa 2 — Catálogo listo ✅: home (hero con promos, categorías, ofertas, más vendidos, cómo funciona,
  receta, piezas para redes, mapa), catálogo con búsqueda/filtros/orden, 51 productos con ilustraciones
  SVG propias, ficha de producto con JSON-LD, sucursales (mapa estilizado + 8 fichas con schema Pharmacy).
- Etapa 3 — Checkout listo ✅: carrito separado en "pago online" y "reserva", checkout en 3 pasos,
  Mercado Pago simulado, confirmación con código + QR + WhatsApp armado, consulta con receta.
  Probado en el navegador: búsqueda → carrito → sucursal → pago simulado → confirmación RF-XXXXX.
  Nota: el puerto 3000 lo usa otra app local, la demo se probó en el 3100.
- Nota a Mr. Pou (catálogo + checkout) enviada (inbox, id n-20261117-2215-e09b).
- Etapa 4 — Panel listo ✅: /admin con resumen de métricas ROI (ventas aseguradas online, pedidos,
  reservas, ticket, clics a WhatsApp, tasa de retiro, gráfico semanal, pedidos por sucursal, canal de
  origen, más vistos, últimos movimientos), pedidos con estados nuevo → preparado → retirado (+ aviso
  por WhatsApp al cliente y apertura por QR/código), recetas recibidas y ABM de ofertas que se publican
  al instante. Filtro por sucursal. Alertas en vivo de pedidos/recetas nuevos.
  Extra: /demo = modo presentación (tienda en un celular + panel al lado, sincronizados).
  SEO: metadata por página, JSON-LD Organization/Product/Pharmacy, sitemap.xml, robots.txt, OG image.
- Nota a Mr. Pou (panel) enviada (inbox, id n-20261117-2223-9d73).
- Etapa 5 — Demo terminada ✅: README.md (cómo levantarla y cómo cambiar marca/colores/sucursales en
  `src/config/site.ts`) y LOOM_GUION.md (recorrido de 5 minutos sobre `/demo`).
  Verificación: `tsc` OK, `eslint` OK, `npm run build` OK (80 páginas estáticas), `npm run dev`
  corriendo en http://localhost:3100 (el 3000 está ocupado por otra app local). Recorrido completo
  probado en el navegador, desktop y celular (marco de /demo): búsqueda → carrito (promo 2da al 50%
  aplicada) → sucursal → pago Mercado Pago simulado → confirmación con código, QR y WhatsApp →
  pedido aparece al instante en el panel → preparado → entregado. Receta de ejemplo llega al panel.
  Alta de oferta desde el panel se publica en la tienda. Sin errores en consola.
  Nada publicado ni deployado: todo queda local.

## Pendientes / ideas para la versión real
- Mercado Pago real (Checkout Pro) y backend con base de datos (hoy: localStorage del navegador).
- Login para el panel con usuario por sucursal.
- Reemplazar ilustraciones SVG por fotos reales del catálogo y conectar stock si la red lo quiere.

