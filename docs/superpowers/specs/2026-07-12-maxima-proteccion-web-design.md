# Sitio web Máxima Protección S.A. — Diseño

Fecha: 2026-07-12
Estado: aprobado por el usuario, listo para plan de implementación

## 1. Contexto

Máxima Protección La Plata S.A. es una empresa real de seguridad electrónica de La Plata, Buenos Aires, con más de 25 años de trayectoria. Lanza un producto nuevo: una **alarma automonitoreada** (avisa directamente al celular del usuario, sin abono mensual).

El sitio anterior (`maximaproteccion.com.ar`) está caído: fue comprometido con spam de apuestas y el hosting lo suspendió. Hoy la empresa **no tiene presencia digital funcionando**.

### Datos verificados de la empresa

Confirmados con fuente primaria durante la investigación:

| Dato | Valor | Fuente |
|---|---|---|
| Razón social | MAXIMA PROTECCION LA PLATA S.A. | CUIT Online, Dateas |
| CUIT | 30-71103275-0 | AFIP vía CUIT Online |
| Habilitación | Prestadora N° 1739, Ministerio de Seguridad PBA | [Listado oficial PDF, 08/07/2024](https://www.mseg.gba.gov.ar/areas/dirprovsegpriv/listados/PRESTADORAS%20HABILITADAS%20AL%2008072024.pdf) |
| Marco legal | Ley 12.297; Seguro de Vida, Responsabilidad Civil y ART | Web propia archivada, 2024 |
| Trayectoria | "Más de 25 años en la ciudad" | Web propia archivada, 2024 |
| Redes | facebook.com/maximaproteccion.ar · instagram.com/maximaproteccion.ar | HTML de la web archivada |

**Datos de contacto: DESCARTADOS.** El cliente confirmó que el WhatsApp, los teléfonos y el domicilio que aparecían en fuentes archivadas **están desactualizados**. No se publican. Habrá datos nuevos, todavía no definidos.

Consecuencia de diseño: los datos de contacto se tratan **con el mismo mecanismo que el producto** — viven en `empresa.ts`, arrancan en `null`, y los componentes se adaptan a su ausencia. No se escriben a mano en ningún lado.

**Dato descartado explícitamente:** apareció en búsquedas una supuesta sanción de 2008 por operar sin habilitación. No tiene fuente primaria localizable y podría corresponder a una empresa homónima. No se usa ni se menciona.

### Contexto competitivo

- **Kits DIY** (X-28, Garnet, Ajax, genéricos de MercadoLibre): sin abono, pero el comprador se instala solo, sin garantía ni respaldo local.
- **Multinacionales** (Verisure, Prosegur, ADT): abono mensual alto, sin arraigo local.
- **Locales** (901 Seguridad Monitoreada es el más profesionalizado): compiten en monitoreo tradicional con abono.

La crítica estándar de la industria al automonitoreo es: *"una notificación al celular no es una respuesta — el teléfono puede estar en silencio o el usuario durmiendo"*. El sitio debe responderla de frente en las FAQ, no ignorarla.

## 2. Decisiones tomadas

| Decisión | Valor |
|---|---|
| Objetivo del sitio | Landing de lanzamiento de la alarma automonitoreada |
| Conversión | **Exclusivamente WhatsApp.** Sin formularios, sin e-commerce, sin backend |
| Posicionamiento | Producto independiente, **sin abono**, que compite de frente con los kits DIY |
| Mantenimiento | El dueño lo actualiza con Claude. Sitio estático |
| Stack | Astro + Tailwind, salida estática. Deploy en Netlify / Cloudflare Pages |
| Dirección visual | Fondo claro y aireado; tipografía en azul marino; amarillo sólo en elementos accionables |
| Paleta | Derivada exclusivamente del logo: azul marino `#1B3A6B`, amarillo `#F0A81C`, azul profundo `#0E1F3A` para footer y franjas de acento, blanco |

### Argumento comercial central

*Mismo "sin abono" que un kit de internet, pero instalado, garantizado y respaldado por una empresa habilitada con 25 años en La Plata.* El kit de MercadoLibre no tiene instalación, ni garantía, ni nadie a quien reclamarle.

### Lo que sabemos del producto

Confirmado: **app en el celular** (armar/desarmar, notificaciones, estado) y **cámaras con video verificación**.
Todo lo demás — modelo, fotos, precio, resto de las prestaciones — está **pendiente** y va como placeholder.

## 3. Arquitectura

Principio rector: **ningún dato variable escrito a mano dentro del HTML.** Todo el contenido sale de dos archivos de datos; los componentes lo consumen.

```
src/
  data/
    empresa.ts        ← razón social, CUIT, prestadora, dirección, teléfonos, WhatsApp, redes
    producto.ts       ← la alarma nueva. Hoy con placeholders
  layouts/
    Layout.astro      ← <head>, SEO, datos estructurados LocalBusiness
  components/
    Header.astro          Hero.astro           Credibilidad.astro
    Producto.astro        ComoFunciona.astro   Comparativa.astro
    PorQueNosotros.astro  Faq.astro            Contacto.astro
    Footer.astro          BotonWhatsapp.astro  (flotante, siempre visible)
  pages/
    index.astro       ← compone las secciones en orden
public/
  images/logo-mp.jpg
```

Un componente por sección. Cuando haya que cambiar la comparativa se abre un archivo de 40 líneas, no una página de 600.

### `empresa.ts` — fuente única de verdad institucional

El número de WhatsApp aparece en cinco lugares (header, hero, botón flotante, contacto, footer). En un solo archivo, cambiarlo es cambiarlo una vez. Escrito a mano, tarde o temprano se cambian cuatro de cinco y el quinto sigue mandando gente a un número viejo.

```ts
export const empresa = {
  // Verificados contra fuente primaria. Se publican.
  razonSocial: "MAXIMA PROTECCION LA PLATA S.A.",
  cuit: "30-71103275-0",
  prestadora: "1739",   // Ministerio de Seguridad PBA, Ley 12.297
  anios: 25,
  ciudad: "La Plata",
  redes: { facebook: "...", instagram: "..." },

  // PENDIENTES. Los viejos están desactualizados y NO se publican.
  whatsapp: null,   // ← al completarlo se activan todos los CTA del sitio
  telefono: null,
  direccion: null,
  horario: null,
}
```

**Comportamiento con `whatsapp: null`:** los CTA se renderizan visualmente (el diseño se ve completo y se puede evaluar) pero **no son clicables** y muestran "Próximamente". No se renderiza ningún enlace `wa.me` roto ni que apunte a un número equivocado.

**Bloqueante para publicar:** el sitio **no se publica** con `whatsapp: null`. Una landing cuya única vía de conversión está desactivada no tiene razón de existir. Se construye ahora, se publica cuando llegue el número.

**Comportamiento con `direccion: null`:** no se renderiza el bloque de dirección, y los datos estructurados degradan de `LocalBusiness` a `Organization` (Google exige dirección para `LocalBusiness`; declararlo sin ella es un dato estructurado inválido). Al completar la dirección, vuelve a `LocalBusiness` automáticamente.

### `producto.ts` — preparado para el producto que todavía no existe

```ts
export const producto = {
  disponible: false,   // true cuando el producto esté definido
  nombre: null,        // string cuando se defina el modelo
  fotos: [],           // rutas de imágenes
  caracteristicas: [
    { titulo: "App en tu celular", descripcion: "..." },      // confirmado
    { titulo: "Video verificación", descripcion: "..." },     // confirmado
  ],
  precio: null,
}
```

**Los componentes reaccionan al estado del archivo.** Ese es el requisito, no "dejar un comentario TODO":

- `fotos` vacío → la galería renderiza un placeholder digno (silueta con el logo sobre fondo de marca), nunca una imagen rota ni un hueco.
- `nombre` en `null` → el copy dice *"nuestra nueva alarma automonitoreada"* en lugar de mostrar un espacio vacío.
- `disponible: false` → se muestra el badge "Próximamente" y el CTA invita a consultar; con `true` desaparece el badge.
- `precio` en `null` → no se renderiza bloque de precio.

Cuando llegue el modelo real se completa este archivo y **el sitio entero se actualiza solo, sin tocar HTML**.

## 4. Secciones de la landing

En orden, de arriba hacia abajo:

1. **Header fijo** — logo, navegación por anclas, botón de WhatsApp siempre visible.
2. **Hero** — *"Alarma automonitoreada. Sin abono. Sin contratos."* Arranca por el diferencial económico, que es lo que trae al que hoy está mirando kits en MercadoLibre. La credibilidad viene después, como respaldo. Foto del producto (placeholder). CTA a WhatsApp.
3. **Franja de credibilidad** — 25 años · Prestadora N° 1739 · Empresa platense · Ley 12.297 con seguros.
4. **La alarma** — galería y características, todo desde `producto.ts`.
5. **Cómo funciona** — tres pasos: la instalamos / la controlás desde la app / te avisa al instante. Desactiva el miedo a que sea complicado.
6. **Comparativa** — tabla de tres columnas: kit de internet / Máxima Protección / multinacional. **Es la sección que cierra la venta:** Máxima Protección es la única columna que dice "no" al abono *y* "sí" a instalación, garantía y habilitación oficial.

   La fila *"¿a quién le reclamás?"* se apoya en la **habilitación oficial N° 1739 y los 25 años**, no en la dirección (que hoy no se publica): *kit de internet → a nadie / multinacional → a un call center / Máxima Protección → a una empresa habilitada, con nombre, CUIT y 25 años en la ciudad*. Cuando haya dirección nueva, la fila puede reforzarse con la oficina física.
7. **Por qué Máxima Protección** — los 25 años contados como historia, no como dato suelto.
8. **Preguntas frecuentes** — incluye obligatoriamente *"¿y si no estoy mirando el celular?"*, que es la objeción real al automonitoreo.
9. **Contacto** — se adapta a `empresa.ts`. Hoy: WhatsApp desactivado con "Próximamente" y redes sociales. Sin dirección ni teléfono. Al completar los datos, la sección crece sola.
10. **Footer** — datos legales: razón social, CUIT, número de prestadora, ley, redes. Todos verificados y publicables hoy.

Más un **botón flotante de WhatsApp** presente durante todo el scroll (desactivado mientras `whatsapp` sea `null`).

## 5. SEO y despliegue

- Datos estructurados JSON-LD. **Hoy `Organization`** (razón social, CUIT, redes); **degradan/ascienden solos según `empresa.ts`**: al cargar dirección y teléfono, pasan a `LocalBusiness`, que es el que hace que Google muestre el negocio en el mapa y con sus horarios. Declarar `LocalBusiness` sin dirección sería un dato estructurado inválido, así que no se hace.
- Meta tags y Open Graph.
- `sitemap.xml` y `robots.txt`.
- Keywords objetivo: *alarmas La Plata*, *alarma sin abono La Plata*, *alarma automonitoreada*.
- Deploy estático. Sin servidor ni base de datos: el vector del hackeo anterior no existe en esta arquitectura.

**Dominio: `maximaproteccion.com.ar`, confirmado en poder del cliente.** Se publica ahí. Conserva la antigüedad registrada desde 2008, que Google ya reconoce.

Al migrar hay que tener en cuenta que el sitio anterior fue comprometido con spam de apuestas indexable. Por lo tanto, al apuntar el dominio al sitio nuevo:

- Cortar el hosting viejo por completo. Nada del sitio comprometido debe seguir sirviéndose.
- Publicar un `robots.txt` limpio, y un `sitemap.xml` que declare únicamente las URLs reales del sitio nuevo.
- Devolver `404` (o `410`) en cualquier ruta vieja de spam, para que Google las desindexe en vez de seguir asociándolas al dominio.
- Verificar el dominio en Google Search Console y solicitar la reindexación. Si el hackeo dejó una marca de "sitio comprometido", ahí es donde se revisa y se pide la revisión de seguridad.

Este punto no es opcional: si el dominio arrastra el spam indexado, la antigüedad que estamos tratando de conservar juega en contra en vez de a favor.

## 6. Verificación

Antes de dar por terminado, con el sitio corriendo:

- El botón de WhatsApp abre el chat con el mensaje precargado, en escritorio y en móvil.
- El sitio se ve correctamente en pantalla de celular. La mayoría del tráfico va a ser móvil.
- Con `producto.ts` en su estado placeholder, ninguna sección se ve rota, vacía o con imágenes faltantes.
- Cambiar `disponible` a `true` y cargar una foto de prueba actualiza el sitio sin tocar ningún componente. Esto prueba que el requisito de "dejar todo preparado" realmente se cumple.
- Lighthouse: performance y accesibilidad en verde.

## 7. Riesgos y pendientes

| Pendiente | Impacto |
|---|---|
| **Número de WhatsApp nuevo** | **Bloqueante para publicar.** Es la única vía de conversión del sitio. Sin él, la landing no puede vender. No bloquea el desarrollo |
| Confirmar que la habilitación N° 1739 sigue vigente en 2026 | **Bloqueante.** El listado verificado es de julio 2024. El sitio lo afirma; debe estar vigente |
| Limpiar el rastro del hackeo en Google (Search Console, desindexado del spam) | **Bloqueante para publicar en el dominio propio** |
| Dirección nueva | No bloquea. Sin ella el sitio funciona, pero se pierde el posicionamiento en el mapa de Google y la comparativa pierde algo de fuerza |
| Modelo, fotos, precio y características del producto | No bloquea. El sitio se publica con placeholders y se completa después |
| Dominio `maximaproteccion.com.ar` | ✅ Resuelto: el cliente lo tiene |
| Repositorio GitHub | ✅ Resuelto: `maximaproteccion-arg/web` |

## 8. Checklist para un sitio profesional (más allá del código)

Relevado a pedido del cliente: qué falta, además de los datos del producto, para que la página esté a la altura de una empresa destacada del rubro.

### Material que aporta el cliente

| Ítem | Para qué | Estado |
|---|---|---|
| Logo original en vectorial (SVG/AI/Corel) o PNG grande con transparencia | Header, favicon, tarjeta de WhatsApp. El JPG actual es de 500 px con fondo blanco | Pendiente. Si no existe, se redibuja como SVG |
| Fotos reales: técnicos, móviles, central de monitoreo, equipo | Único activo visual que la competencia no puede fingir. Stock = genérico | Pendiente |
| 2-3 testimonios de clientes reales, con nombre y barrio (con permiso) | En seguridad, la palabra de un vecino vale más que cualquier copy | Pendiente |
| Año exacto de fundación + 2-3 hitos de la historia | Sección "Por qué nosotros". Hoy sólo hay "más de 25 años" | Pendiente |
| Zona de cobertura (localidades) | Texto, SEO local, filtrar consultas fuera de zona | Pendiente |
| Horario de atención nuevo | Sección contacto, ficha de Google | Pendiente (junto con WhatsApp) |

### Presencia externa

| Ítem | Para qué | Estado |
|---|---|---|
| Ficha de Google Business Profile | El recuadro con mapa y reseñas en "alarmas La Plata". Pesa tanto o más que la web en búsquedas locales | Requiere dirección nueva |
| Email corporativo `contacto@maximaproteccion.com.ar` | Un Gmail en la web de una empresa de seguridad resta | Sólo configurarlo; el dominio ya está |
| Redes sociales activas | El sitio las linkea; si la última publicación es vieja, revisar antes de mandar tráfico | A revisar por el cliente |

### Técnico y legal (lo resuelve Claude, con accesos del cliente)

| Ítem | Para qué |
|---|---|
| Google Search Console | Limpiar el rastro del hackeo + medir posicionamiento |
| Analítica liviana (medir visitas y clics en WhatsApp) | Saber si el sitio vende. Sin esto no hay forma de evaluarlo |
| Imagen Open Graph (tarjeta al compartir el link por WhatsApp) | El canal de venta es WhatsApp: esa tarjeta es marketing puro |
| Política de privacidad + QR Data Fiscal AFIP | Legales estándar de sitio comercial argentino |
| Acceso al panel NIC.ar / DNS | Apuntar el dominio al sitio nuevo al publicar |
