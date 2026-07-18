# Máxima Protección — Sitio web

Landing estática de la alarma automonitoreada. Astro + Tailwind 4.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local en http://localhost:4321 |
| `npm run build` | Genera el sitio en `dist/` |
| `npm run test` | Tests de la lógica (Vitest) |
| `npm run verify` | Build + verificación de invariantes del HTML |

## Cómo cargar los datos que faltan

**Todo el contenido variable vive en `src/data/`. No hay que tocar componentes.**

### Producto (`src/data/producto.ts` y `src/data/accesorios.ts`)

El panel Zenity Smart ZN10 PRO y el catálogo de accesorios ya están cargados.
Falta: copiar las fotos a `public/images/producto/` y listarlas en `fotos`.

**Regla de precios:** en el repo van únicamente los **precios finales de venta**.
Los costos del proveedor y el margen no se escriben en ningún archivo (el repo es
público). Para actualizar precios: pasarle a Claude la lista nueva del proveedor
y pedirle que recalcule. `npm run verify` falla si un costo conocido del
proveedor aparece publicado.

### Cuando haya WhatsApp nuevo (`src/data/empresa.ts`)

1. Completar `whatsapp` con el número (ej: `"2211234567"`). Se activan todos los CTA.
2. Completar `telefono`, `direccion` y `horario` cuando existan: la sección de
   contacto crece sola y el JSON-LD asciende a LocalBusiness (Google Maps).

Después de cualquier cambio: `npm run verify`.

## No publicar hasta (ver spec §7)

- [ ] WhatsApp nuevo cargado (sin él la landing no convierte)
- [ ] Habilitación N° 1739 confirmada vigente
- [ ] Search Console: limpiar el rastro del hackeo del dominio

## Deploy

Estático puro: Netlify o Cloudflare Pages. Build: `npm run build`, output: `dist/`.
Dominio: maximaproteccion.com.ar (en poder del cliente).

## Documentación

- Spec de diseño: `docs/superpowers/specs/2026-07-12-maxima-proteccion-web-design.md`
- Plan de implementación: `docs/superpowers/plans/2026-07-17-maxima-proteccion-web.md`
