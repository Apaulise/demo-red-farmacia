# Guion para el Loom (3 a 5 minutos)

**Objetivo del video:** que la red vea su propia farmacia vendiendo online mañana, y que entienda
cuánto puede crecer con números en la mano.

## Antes de grabar (2 minutos)

1. `npm run dev` y abrí **http://localhost:3000/demo** (o el puerto que uses) en pantalla completa.
2. Tocá **"Reiniciar demo"** arriba a la derecha para arrancar con los datos de ejemplo limpios.
3. Cerrá notificaciones, ocultá favoritos y poné el zoom del navegador en 90% si la pantalla es chica.
4. Tené a mano una segunda pestaña con **/admin** a pantalla completa para la parte de métricas.

---

## 0:00 – 0:25 · Apertura (cámara + /demo)

> "Hola, soy Agustín de Smokia. Les armé una demo funcionando de cómo sería la red online: a la
> izquierda lo que ve el cliente en el celular, a la derecha lo que ven ustedes en el panel. Todo lo
> que van a ver anda de verdad."

- Mostrá la pantalla de `/demo` quieta 2 segundos.

## 0:25 – 1:05 · La tienda (celular)

- Deslizá el **carrusel del inicio**: "Las promos se cargan desde el panel y aparecen solas acá."
- Bajá a **categorías** y **ofertas**: "Un solo catálogo para las 8 farmacias, con los mismos precios."
- Tocá **"Retirás en…"** y mostrá el **mapa con las 8 sucursales** → elegí *Berazategui Centro*.
  "No hay envíos: el cliente elige la farmacia más cercana y retira."
- Mostrá que hay una **abierta 24 hs** (Plaza Mitre).

## 1:05 – 2:10 · Compra completa (celular)

1. Buscá **"pañales"** → agregá **2 paquetes**: "La promo 2da al 50% se aplica sola."
2. Buscá **"ibuprofeno"** → agregá a la reserva.
3. Abrí el **carrito**: "Fíjense que se separa solo: lo de perfumería y bebés se paga online con
   Mercado Pago; el medicamento de venta libre se **reserva** y se paga en el mostrador, como pide la
   normativa. Y todo dice *sujeto a disponibilidad*."
4. **Continuar al pago** → nombre y celular → **Pagar con Mercado Pago** (simulado) → *¡Pago aprobado!*
5. Pantalla de **confirmación**: "Código de retiro, QR para el mostrador y un botón que manda el
   pedido armado al WhatsApp de la sucursal."

## 2:10 – 2:40 · El pedido llega al panel (lado derecho)

- Señalá el aviso **"🛎️ Nuevo pedido RF-…"** que apareció en el panel y cómo subieron los números.
- En el panel: **Pedidos** → abrí el pedido → **Marcar preparado** → botón verde
  **"Avisar que está listo"** (WhatsApp al cliente) → **Entregar**.
  "La farmacia sabe qué cobrar en caja: lo pagado online ya está, la reserva se cobra al entregar."
- Volvé al celular: el estado del pedido pasó a **Listo para retirar** solo.

## 2:40 – 3:05 · Receta por WhatsApp

- En el celular: **Receta** → "Usar una receta de ejemplo" → elegí PAMI → **Enviar consulta**.
- En el panel: **Recetas** → aparece arriba → **Responder** por WhatsApp.
  "Es solo una consulta: no se vende con receta online, pero el cliente ya sabe que lo tienen."

## 3:05 – 4:10 · Métricas para hablar de plata (pestaña /admin a pantalla completa)

- **Ventas aseguradas online** (tarjeta verde): "Plata que entra antes de que el cliente llegue
  al mostrador, y que hoy se va a la cadena de la otra cuadra."
- **Gráfico semanal**: pasá el mouse por las barras. "Así se ve cuando la red empieza a empujar el
  canal online: crece semana a semana."
- **Pedidos por sucursal** y filtro arriba a la derecha: elegí una farmacia. "Cada dueño ve lo suyo,
  y la red ve todo."
- **¿De dónde vienen?**: "Instagram y Google traen la mayoría: por eso sumamos las piezas para redes y
  el SEO local de cada sucursal."
- **Clics a WhatsApp** y **más vistos**: "Saben qué se busca y qué conviene tener en stock y promocionar."

## 4:10 – 4:40 · Ofertas y redes

- **Ofertas** → **Nueva oferta** → cambiá el color y el porcentaje → **Guardar y publicar**.
- Volvé a la tienda (inicio): la promo nueva ya está en el carrusel y en la sección
  **"Promos que nacen en redes"** como historia y post de Instagram.

## 4:40 – 5:00 · Cierre (cámara)

> "Esto es una demo, pero el producto real es esto mismo con su marca, sus farmacias y Mercado Pago
> conectado de verdad. En la propuesta les dejo plazos, inversión y el cálculo de retorno. ¿Lo
> vemos juntos esta semana?"

---

### Tips

- Si algo se desordena, **Reiniciar demo** deja todo como al principio.
- Los números de WhatsApp son ficticios: al tocar el botón se abre WhatsApp con el mensaje armado,
  pero no lo mandes.
- Nombre, colores y sucursales se cambian en `src/config/site.ts` (ver README) si querés grabar una
  versión con la marca del cliente.
