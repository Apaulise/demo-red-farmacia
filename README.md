# Red Farmacias · demo

Demo funcional de una plataforma para una red de farmacias independientes de Berazategui:
un catálogo compartido, retiro en sucursal, pago online simulado con Mercado Pago, reservas de
venta libre, consulta con receta por WhatsApp y un panel de administración con métricas de la red.

> Todo es local: no hay servicios pagos, claves ni datos reales. Las direcciones, teléfonos,
> pedidos y clientes son ficticios. El pago con Mercado Pago es una **simulación** (no cobra nada).

## Cómo levantarla

Requisitos: Node 20 o superior.

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. Si el puerto 3000 ya está ocupado, usá otro:
`npm run dev -- -p 3100` → http://localhost:3100.

Para la versión optimizada: `npm run build && npm start`.

### Rutas principales

| Ruta | Qué es |
|---|---|
| `/` | Inicio: promos, categorías, ofertas, cómo funciona, receta, piezas para redes, mapa de sucursales |
| `/productos` | Catálogo con búsqueda, filtros (categoría, ofertas, forma de compra) y orden |
| `/productos/[slug]` | Ficha de producto |
| `/sucursales` y `/sucursales/[slug]` | Mapa y ficha de cada farmacia (con schema.org `Pharmacy` para Google) |
| `/carrito` → `/checkout` → `/confirmacion` | Flujo de compra completo con código y QR de retiro |
| `/receta` | Consulta con foto de receta (respuesta por WhatsApp) |
| `/admin` | Panel de la red: resumen, pedidos, recetas y ofertas |
| `/demo` | **Modo presentación**: la tienda en un celular y el panel al lado, sincronizados en vivo |

## Cómo cambiar nombre, logo, colores y sucursales

Todo está en **un solo archivo: `src/config/site.ts`**.

- `site.name`, `site.shortName`, `site.tagline`, `site.city`: textos de marca.
- `site.logo`: dejalo vacío para usar el isotipo por defecto, o poné la ruta de una imagen en
  `/public` (por ejemplo `"/logo.svg"`).
- `site.colors.brand` / `accent` / `ink`: un hex por color. Todas las variantes (claros, oscuros,
  bordes) se derivan solas, así que cambiando un valor cambia toda la web y el panel.
- `site.social`: usuarios de Instagram, Facebook y TikTok que aparecen en las piezas para redes.
- `site.url`: dominio que se usa para SEO (sitemap, canonical, schema).
- `branches`: lista de sucursales. Cada una tiene nombre, dirección, barrio, horario legible,
  horario para Google (`openingHours`), WhatsApp (formato `549...`), teléfono, farmacéutico/a,
  posición en el mapa ilustrativo (`map.x` y `map.y` de 0 a 100) y coordenadas para schema.org.
  Podés agregar o quitar sucursales y todo se adapta.

Otros archivos de datos:

- `src/data/products.ts`: los 52 productos de ejemplo (nombre, precio, categoría, forma y color
  de la ilustración). Las categorías definen la forma de compra: venta libre = **reserva**; el resto
  = **pago online**.
- `src/data/offers.ts`: ofertas iniciales (también se crean y editan desde `/admin/ofertas`).
- `src/lib/seed.ts`: generador de pedidos, recetas y métricas de ejemplo (8 semanas de historia).

## Cómo funciona la demo

- **Persistencia**: `localStorage` del navegador. La tienda y el panel comparten datos, y si están
  abiertos en dos pestañas (o en `/demo`), un pedido nuevo aparece en el panel al instante.
- **Reiniciar**: botón "Reiniciar demo" en el panel o en `/demo` para volver a los datos de ejemplo.
- **Normativa**: perfumería, dermocosmética, bebés y cuidado personal se pagan online y se retiran;
  los medicamentos de venta libre se **reservan** y se pagan y dispensan en la farmacia. La receta
  es solo una **consulta**. Todo está aclarado en carrito, checkout y confirmación con la leyenda
  "sujeto a disponibilidad".
- **WhatsApp**: los botones abren `wa.me` con el mensaje armado (código de pedido, detalle y montos)
  hacia el número ficticio de cada sucursal.
- **QR de retiro**: apunta a `/admin/pedidos?codigo=...`, así la farmacia lo escanea y abre el pedido
  para entregarlo.
- **SEO**: metadata por página, Open Graph, JSON-LD (`Organization`, `Product`, `Pharmacy` por
  sucursal), `sitemap.xml` y `robots.txt`.

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4, `lucide-react` para íconos y `qrcode` para
los QR. Ilustraciones de producto generadas en SVG (`src/components/ProductArt.tsx`), sin marcas
reales.
