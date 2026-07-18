# Sitio Máxima Protección — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Landing estática de lanzamiento de la alarma automonitoreada de Máxima Protección La Plata S.A., con todos los datos variables (empresa y producto) parametrizados en dos archivos que los componentes consumen reactivamente.

**Architecture:** Astro 5 con salida estática, Tailwind CSS 4 vía plugin de Vite. Una página (`index.astro`) compuesta por un componente por sección. `src/data/empresa.ts` y `src/data/producto.ts` son las únicas fuentes de verdad; los componentes se adaptan a campos en `null` (CTA desactivados, placeholders dignos, JSON-LD que degrada de LocalBusiness a Organization). Lógica pura en `src/lib/` testeada con Vitest.

**Tech Stack:** Astro ^5, Tailwind CSS ^4 (`@tailwindcss/vite`), `@astrojs/sitemap`, Vitest, TypeScript estricto.

**Spec:** `docs/superpowers/specs/2026-07-12-maxima-proteccion-web-design.md`

**Restricciones no negociables (del spec):**
- Los datos de contacto viejos (221 613-6661, 0221 470-6262, calle 23) **no aparecen en ninguna parte del código ni del HTML generado**. El script de verificación lo comprueba.
- Con `whatsapp: null` no se genera **ningún** enlace `wa.me`. Los CTA se ven pero no son clicables.
- Paleta exclusiva del logo: navy `#1B3A6B`, gold `#F0A81C`, navy-deep `#0E1F3A`, fondo claro `#F7F9FC`. Gold solo para elementos accionables.

## Estructura de archivos

```
astro.config.mjs            ← site, sitemap, tailwind
package.json / tsconfig.json
src/
  styles/global.css         ← @theme con la paleta del logo
  data/empresa.ts           ← datos institucionales; contacto en null
  data/producto.ts          ← producto con placeholders; helper nombreProducto()
  lib/whatsapp.ts           ← waHref() puro, testeado
  lib/jsonld.ts             ← datosEstructurados() puro, testeado
  layouts/Layout.astro      ← head, SEO, OG, JSON-LD
  components/
    CtaWhatsapp.astro       ← botón; estado activo/desactivado según empresa.whatsapp
    Header.astro  Hero.astro  Credibilidad.astro  FotoProducto.astro
    Producto.astro  ComoFunciona.astro  Comparativa.astro
    PorQueNosotros.astro  Faq.astro  Contacto.astro  Footer.astro
    BotonWhatsapp.astro     ← flotante; no se renderiza si whatsapp es null
  pages/index.astro
tests/whatsapp.test.ts  tests/jsonld.test.ts
scripts/check-dist.mjs      ← verifica invariantes del HTML generado
public/robots.txt  public/favicon.svg  public/images/logo-mp.jpg
README.md
```

---

### Task 1: Scaffold del proyecto

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `src/pages/index.astro` (provisorio), `public/robots.txt`, `public/favicon.svg`
- Move: `images/logo-mp.jpg` → `public/images/logo-mp.jpg`

- [ ] **Step 1: Crear `package.json`**

```json
{
  "name": "maxima-proteccion-web",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "verify": "npm run build && node scripts/check-dist.mjs"
  }
}
```

- [ ] **Step 2: Instalar dependencias**

Run: `npm install astro @astrojs/sitemap tailwindcss @tailwindcss/vite && npm install -D vitest @astrojs/check typescript`
Expected: sin errores; se crea `node_modules/` y `package-lock.json`.

- [ ] **Step 3: Crear `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://maximaproteccion.com.ar",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 4: Crear `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Crear `src/styles/global.css`** — la paleta sale del logo y de ningún otro lado

```css
@import "tailwindcss";

@theme {
  --color-navy: #1b3a6b;
  --color-navy-deep: #0e1f3a;
  --color-gold: #f0a81c;
  --color-gold-soft: #fdf3dd;
  --color-cloud: #f7f9fc;
}

html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 6: Crear `src/pages/index.astro` provisorio** (se reemplaza en Task 5)

```astro
---
import "../styles/global.css";
---

<html lang="es">
  <head><meta charset="utf-8" /><title>Máxima Protección</title></head>
  <body><h1 class="text-navy">En construcción</h1></body>
</html>
```

- [ ] **Step 7: Mover el logo y crear `public/robots.txt` y `public/favicon.svg`**

Run: `git mv images/logo-mp.jpg public/images/logo-mp.jpg` (crear `public/images/` antes)

`public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://maximaproteccion.com.ar/sitemap-index.xml
```

`public/favicon.svg` (eco del logo: disco gold + ondas sobre navy):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#1B3A6B"/>
  <circle cx="32" cy="32" r="11" fill="#F0A81C"/>
  <path d="M16 22a22 22 0 0 0 0 20" stroke="#F0A81C" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <path d="M48 22a22 22 0 0 1 0 20" stroke="#F0A81C" stroke-width="4.5" fill="none" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 8: Verificar que el proyecto compila**

Run: `npm run build`
Expected: `Complete!` y aparece `dist/index.html` con "En construcción".

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "Scaffold: Astro 5 + Tailwind 4, paleta del logo, robots y favicon"
```

---

### Task 2: Archivos de datos — las dos fuentes de verdad

**Files:**
- Create: `src/data/empresa.ts`, `src/data/producto.ts`

- [ ] **Step 1: Crear `src/data/empresa.ts`**

```ts
export interface Empresa {
  razonSocial: string;
  nombreComercial: string;
  cuit: string;
  prestadora: string;
  ley: string;
  anios: number;
  ciudad: string;
  provincia: string;
  dominio: string;
  redes: { facebook: string; instagram: string };
  whatsapp: string | null;
  telefono: string | null;
  direccion: string | null;
  horario: string | null;
  email: string | null;
}

export const empresa: Empresa = {
  // Verificados contra fuente primaria (ver spec §1). Se publican.
  razonSocial: "MAXIMA PROTECCION LA PLATA S.A.",
  nombreComercial: "Máxima Protección",
  cuit: "30-71103275-0",
  prestadora: "1739",
  ley: "12.297",
  anios: 25,
  ciudad: "La Plata",
  provincia: "Buenos Aires",
  dominio: "https://maximaproteccion.com.ar",
  redes: {
    facebook: "https://www.facebook.com/maximaproteccion.ar",
    instagram: "https://www.instagram.com/maximaproteccion.ar",
  },

  // Los datos anteriores a 2026 están desactualizados y NO deben publicarse.
  // Al completar whatsapp se activan todos los CTA del sitio.
  whatsapp: null, // solo dígitos, ej: "2211234567"
  telefono: null,
  direccion: null, // al completarla, el JSON-LD asciende solo a LocalBusiness
  horario: null,
  email: null,
};
```

- [ ] **Step 2: Crear `src/data/producto.ts`**

```ts
export interface Caracteristica {
  icono: "app" | "video" | "bell";
  titulo: string;
  descripcion: string;
}

export interface Producto {
  disponible: boolean;
  nombre: string | null;
  marca: string | null;
  fotos: string[]; // rutas bajo public/, ej: "/images/producto/frente.jpg"
  caracteristicas: Caracteristica[];
  especificaciones: { etiqueta: string; valor: string }[];
  precio: string | null;
}

export const producto: Producto = {
  // Cuando llegue el modelo real: completar estos campos y nada más.
  // Ningún componente hace falta tocar.
  disponible: false,
  nombre: null,
  marca: null,
  fotos: [],
  caracteristicas: [
    {
      icono: "app",
      titulo: "Controlala desde tu celular",
      descripcion:
        "Armás, desarmás y ves el estado de tu alarma desde la app, estés donde estés.",
    },
    {
      icono: "video",
      titulo: "Video verificación",
      descripcion:
        "Cuando algo pasa, lo ves: mirá tu propiedad en vivo desde el teléfono.",
    },
    {
      icono: "bell",
      titulo: "Aviso instantáneo",
      descripcion:
        "Notificación en el momento ante cualquier evento. Sin intermediarios.",
    },
  ],
  especificaciones: [],
  precio: null,
};

export function nombreProducto(p: Producto): string {
  return p.nombre ?? "nuestra nueva alarma automonitoreada";
}
```

- [ ] **Step 3: Verificar tipos**

Run: `npm run check`
Expected: `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add src/data && git commit -m "Datos: empresa.ts y producto.ts como fuentes únicas de verdad"
```

---

### Task 3: `waHref()` — TDD

**Files:**
- Test: `tests/whatsapp.test.ts`
- Create: `src/lib/whatsapp.ts`

- [ ] **Step 1: Escribir el test que falla**

`tests/whatsapp.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { MENSAJE_WHATSAPP, waHref } from "../src/lib/whatsapp";

describe("waHref", () => {
  it("devuelve null sin número — jamás un enlace roto", () => {
    expect(waHref(null)).toBeNull();
    expect(waHref("")).toBeNull();
    expect(waHref("  ")).toBeNull();
  });

  it("arma el enlace wa.me con 549 y el mensaje precargado", () => {
    const href = waHref("2211234567");
    expect(href).toBe(
      `https://wa.me/5492211234567?text=${encodeURIComponent(MENSAJE_WHATSAPP)}`,
    );
  });

  it("normaliza formatos con espacios, guiones, 0 inicial y prefijos 54/549", () => {
    const esperado = waHref("2211234567");
    expect(waHref("0221 123-4567")).toBe(esperado);
    expect(waHref("+54 9 221 123 4567")).toBe(esperado);
    expect(waHref("54 221 123 4567")).toBe(esperado);
  });

  it("acepta mensaje personalizado", () => {
    expect(waHref("2211234567", "Hola")).toContain("text=Hola");
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx vitest run tests/whatsapp.test.ts`
Expected: FAIL — `Cannot find module '../src/lib/whatsapp'`.

- [ ] **Step 3: Implementar `src/lib/whatsapp.ts`**

```ts
export const MENSAJE_WHATSAPP =
  "Hola, quiero más información sobre la alarma automonitoreada.";

/**
 * Convierte un número argentino en enlace wa.me.
 * Devuelve null si no hay número: el sitio no debe generar jamás
 * un enlace de WhatsApp roto o hacia un número equivocado.
 */
export function waHref(
  numero: string | null,
  mensaje: string = MENSAJE_WHATSAPP,
): string | null {
  if (!numero) return null;
  let digitos = numero.replace(/\D/g, "");
  if (digitos.length === 0) return null;

  if (digitos.startsWith("549")) digitos = digitos.slice(3);
  else if (digitos.startsWith("54")) digitos = digitos.slice(2);
  if (digitos.startsWith("0")) digitos = digitos.slice(1);

  return `https://wa.me/549${digitos}?text=${encodeURIComponent(mensaje)}`;
}
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx vitest run tests/whatsapp.test.ts`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/whatsapp.ts tests/whatsapp.test.ts && git commit -m "waHref: enlace wa.me normalizado; null si no hay número"
```

---

### Task 4: `datosEstructurados()` — TDD

**Files:**
- Test: `tests/jsonld.test.ts`
- Create: `src/lib/jsonld.ts`

- [ ] **Step 1: Escribir el test que falla**

`tests/jsonld.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { empresa } from "../src/data/empresa";
import { datosEstructurados } from "../src/lib/jsonld";

describe("datosEstructurados", () => {
  it("sin dirección es Organization y no declara address ni telephone", () => {
    const d = datosEstructurados({ ...empresa, direccion: null });
    expect(d["@type"]).toBe("Organization");
    expect(d).not.toHaveProperty("address");
    expect(d).not.toHaveProperty("telephone");
  });

  it("con dirección asciende a LocalBusiness con PostalAddress", () => {
    const d = datosEstructurados({ ...empresa, direccion: "Calle Falsa 123" });
    expect(d["@type"]).toBe("LocalBusiness");
    expect(d.address).toMatchObject({
      "@type": "PostalAddress",
      streetAddress: "Calle Falsa 123",
      addressLocality: "La Plata",
      addressCountry: "AR",
    });
  });

  it("incluye telephone y openingHours solo si existen", () => {
    const base = { ...empresa, direccion: "Calle Falsa 123" };
    expect(datosEstructurados(base)).not.toHaveProperty("telephone");
    const d = datosEstructurados({ ...base, telefono: "2210000000", horario: "Mo-Fr 09:00-17:00" });
    expect(d.telephone).toBe("2210000000");
    expect(d.openingHours).toBe("Mo-Fr 09:00-17:00");
  });

  it("siempre lleva identidad legal y redes", () => {
    const d = datosEstructurados(empresa);
    expect(d.legalName).toBe("MAXIMA PROTECCION LA PLATA S.A.");
    expect(d.taxID).toBe("30-71103275-0");
    expect(d.sameAs).toEqual([empresa.redes.facebook, empresa.redes.instagram]);
  });
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npx vitest run tests/jsonld.test.ts`
Expected: FAIL — `Cannot find module '../src/lib/jsonld'`.

- [ ] **Step 3: Implementar `src/lib/jsonld.ts`**

```ts
import type { Empresa } from "../data/empresa";

/**
 * JSON-LD para Google. Sin dirección declara Organization:
 * LocalBusiness exige dirección postal y declararlo sin ella
 * es un dato estructurado inválido. Al cargar la dirección en
 * empresa.ts, asciende solo.
 */
export function datosEstructurados(e: Empresa): Record<string, unknown> {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: e.nombreComercial,
    legalName: e.razonSocial,
    taxID: e.cuit,
    url: e.dominio,
    logo: `${e.dominio}/images/logo-mp.jpg`,
    sameAs: [e.redes.facebook, e.redes.instagram],
  };
  if (!e.direccion) return base;

  return {
    ...base,
    "@type": "LocalBusiness",
    address: {
      "@type": "PostalAddress",
      streetAddress: e.direccion,
      addressLocality: e.ciudad,
      addressRegion: e.provincia,
      addressCountry: "AR",
    },
    ...(e.telefono ? { telephone: e.telefono } : {}),
    ...(e.horario ? { openingHours: e.horario } : {}),
  };
}
```

- [ ] **Step 4: Correr y verificar que pasa**

Run: `npx vitest run`
Expected: los 2 archivos de test en verde (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/jsonld.ts tests/jsonld.test.ts && git commit -m "JSON-LD: Organization que asciende a LocalBusiness al haber dirección"
```

---

### Task 5: `Layout.astro` + índice real

**Files:**
- Create: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro` (reemplazo completo)

- [ ] **Step 1: Crear `src/layouts/Layout.astro`**

```astro
---
import { empresa } from "../data/empresa";
import { datosEstructurados } from "../lib/jsonld";
import "../styles/global.css";

interface Props {
  titulo?: string;
  descripcion?: string;
}

const {
  titulo = "Alarma automonitoreada sin abono en La Plata | Máxima Protección",
  descripcion = "Alarma automonitoreada sin abono mensual: te avisa a tu celular al instante. Instalada y garantizada por Máxima Protección, empresa platense con más de 25 años, prestadora N° 1739 del Ministerio de Seguridad de la Provincia de Buenos Aires.",
} = Astro.props;

const canonical = new URL(Astro.url.pathname, Astro.site);
const ogImage = new URL("/images/logo-mp.jpg", Astro.site);
const jsonld = JSON.stringify(datosEstructurados(empresa));
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{titulo}</title>
    <meta name="description" content={descripcion} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="es_AR" />
    <meta property="og:site_name" content={empresa.nombreComercial} />
    <meta property="og:title" content={titulo} />
    <meta property="og:description" content={descripcion} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:card" content="summary" />
    <script type="application/ld+json" set:html={jsonld} />
  </head>
  <body class="bg-white font-sans text-navy antialiased">
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Reemplazar `src/pages/index.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout>
  <main>
    <!-- Secciones: se agregan en las tareas 6 a 10 -->
  </main>
</Layout>
```

- [ ] **Step 3: Verificar**

Run: `npm run build`
Expected: build OK. `dist/index.html` contiene `application/ld+json` con `"@type":"Organization"` y `og:image`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Layout: SEO, Open Graph y JSON-LD reactivo a empresa.ts"
```

---

### Task 6: CTA de WhatsApp + Header + botón flotante

**Files:**
- Create: `src/components/CtaWhatsapp.astro`, `src/components/Header.astro`, `src/components/BotonWhatsapp.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear `src/components/CtaWhatsapp.astro`**

El único lugar del sitio que decide si un CTA está activo. Con `whatsapp: null` renderiza un `<span>` no clicable con "Próximamente" — nunca un `<a>` muerto.

```astro
---
import { empresa } from "../data/empresa";
import { waHref } from "../lib/whatsapp";

interface Props {
  texto?: string;
  grande?: boolean;
}

const { texto = "Consultar por WhatsApp", grande = false } = Astro.props;
const href = waHref(empresa.whatsapp);
const dimension = grande
  ? "px-7 py-3.5 text-base gap-2.5"
  : "px-5 py-2.5 text-sm gap-2";
---

{
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      class={`inline-flex items-center rounded-lg bg-gold font-bold text-navy-deep shadow-sm transition hover:brightness-105 active:scale-[0.98] ${dimension}`}
    >
      <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
      {texto}
    </a>
  ) : (
    <span
      class={`inline-flex cursor-not-allowed items-center rounded-lg border-2 border-dashed border-gold/60 bg-gold-soft font-bold text-navy/60 ${dimension}`}
      title="Estamos actualizando nuestras líneas de atención"
      aria-disabled="true"
    >
      <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
      {texto} · Próximamente
    </span>
  )
}
```

- [ ] **Step 2: Crear `src/components/Header.astro`**

```astro
---
import { empresa } from "../data/empresa";
import CtaWhatsapp from "./CtaWhatsapp.astro";

const enlaces = [
  { href: "#la-alarma", label: "La alarma" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#por-que-nosotros", label: "Por qué nosotros" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
];
---

<header class="sticky top-0 z-40 border-b border-navy/10 bg-white/90 backdrop-blur">
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
    <a href="#" class="flex items-center gap-2" aria-label={empresa.nombreComercial}>
      <img src="/images/logo-mp.jpg" alt="" class="h-10 w-auto" width="40" height="40" />
      <span class="text-lg font-extrabold tracking-tight">
        <span class="text-gold">Máxima</span><span class="text-navy">protección</span>
      </span>
    </a>
    <nav class="hidden items-center gap-6 text-sm font-semibold text-navy/80 md:flex" aria-label="Principal">
      {enlaces.map((e) => (
        <a href={e.href} class="transition hover:text-navy">{e.label}</a>
      ))}
    </nav>
    <CtaWhatsapp texto="WhatsApp" />
  </div>
</header>
```

- [ ] **Step 3: Crear `src/components/BotonWhatsapp.astro`**

Flotante. Si no hay número, no se renderiza nada: un botón flotante muerto que persigue el scroll es peor que ninguno (interpretación acordada del "desactivado" del spec).

```astro
---
import { empresa } from "../data/empresa";
import { waHref } from "../lib/whatsapp";

const href = waHref(empresa.whatsapp);
---

{
  href && (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label="Escribinos por WhatsApp"
      class="fixed right-5 bottom-5 z-50 flex size-14 items-center justify-center rounded-full bg-gold text-navy-deep shadow-lg transition hover:scale-105"
    >
      <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
    </a>
  )
}
```

- [ ] **Step 4: Sumar al índice** — `src/pages/index.astro` queda:

```astro
---
import Layout from "../layouts/Layout.astro";
import Header from "../components/Header.astro";
import BotonWhatsapp from "../components/BotonWhatsapp.astro";
---

<Layout>
  <Header />
  <main>
    <!-- Secciones: se agregan en las tareas 7 a 10 -->
  </main>
  <BotonWhatsapp />
</Layout>
```

- [ ] **Step 5: Verificar**

Run: `npm run build`
Expected: build OK. En `dist/index.html` **no** existe la cadena `wa.me` y **sí** existe `Próximamente`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "CTA de WhatsApp con estado desactivado, header y flotante"
```

---

### Task 7: Hero + FotoProducto + franja de credibilidad

**Files:**
- Create: `src/components/FotoProducto.astro`, `src/components/Hero.astro`, `src/components/Credibilidad.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear `src/components/FotoProducto.astro`**

Placeholder digno mientras `producto.fotos` esté vacío: logo sobre fondo de marca, nunca una imagen rota.

```astro
---
import { producto, nombreProducto } from "../data/producto";

interface Props {
  clase?: string;
}

const { clase = "" } = Astro.props;
const [principal, ...resto] = producto.fotos;
---

{
  principal ? (
    <figure class={clase}>
      <img
        src={principal}
        alt={`Foto de ${nombreProducto(producto)}`}
        class="w-full rounded-2xl object-cover shadow-md"
        loading="lazy"
      />
      {resto.length > 0 && (
        <div class="mt-3 grid grid-cols-3 gap-3">
          {resto.map((foto, i) => (
            <img
              src={foto}
              alt={`Foto ${i + 2} de ${nombreProducto(producto)}`}
              class="aspect-square w-full rounded-xl object-cover"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </figure>
  ) : (
    <div
      class={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-navy/10 bg-cloud p-10 text-center ${clase}`}
    >
      <img src="/images/logo-mp.jpg" alt="" class="h-20 w-auto opacity-70" loading="lazy" />
      <p class="text-sm font-semibold text-navy/60">
        Fotos del equipo: muy pronto
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Crear `src/components/Hero.astro`**

```astro
---
import { empresa } from "../data/empresa";
import CtaWhatsapp from "./CtaWhatsapp.astro";
import FotoProducto from "./FotoProducto.astro";
---

<section class="border-b border-navy/10 bg-cloud">
  <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
    <div>
      <div class="mb-5 h-1 w-14 rounded bg-gold"></div>
      <h1 class="text-4xl font-extrabold tracking-tight text-navy md:text-5xl">
        Alarma automonitoreada.<br />Sin abono. Sin contratos.
      </h1>
      <p class="mt-5 max-w-prose text-lg leading-relaxed text-navy/70">
        Tu casa te avisa a vos: al instante, en tu celular, estés donde estés.
        Instalada y garantizada por la empresa que hace más de {empresa.anios} años
        protege a los platenses.
      </p>
      <div class="mt-8">
        <CtaWhatsapp grande />
      </div>
      <div class="mt-6 flex flex-wrap gap-2">
        <span class="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-navy shadow-sm">
          Más de {empresa.anios} años en {empresa.ciudad}
        </span>
        <span class="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-navy shadow-sm">
          Prestadora N° {empresa.prestadora} · Min. de Seguridad PBA
        </span>
      </div>
    </div>
    <FotoProducto clase="md:justify-self-end md:w-full" />
  </div>
</section>
```

- [ ] **Step 3: Crear `src/components/Credibilidad.astro`**

```astro
---
import { empresa } from "../data/empresa";

const items = [
  { valor: `+${empresa.anios}`, detalle: "años protegiendo hogares y comercios de La Plata" },
  { valor: `N° ${empresa.prestadora}`, detalle: "prestadora habilitada por el Ministerio de Seguridad PBA" },
  { valor: `Ley ${empresa.ley}`, detalle: "seguros de vida, responsabilidad civil y ART" },
  { valor: "S.A.", detalle: "empresa platense con nombre, CUIT y trayectoria" },
];
---

<section class="bg-navy" aria-label="Credenciales de la empresa">
  <div class="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4">
    {items.map((i) => (
      <div class="text-center">
        <p class="text-2xl font-extrabold text-gold">{i.valor}</p>
        <p class="mt-1 text-xs leading-snug text-white/80">{i.detalle}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 4: Sumar ambas secciones al `<main>` del índice** (imports arriba, componentes en orden):

```astro
<main>
  <Hero />
  <Credibilidad />
  <!-- Secciones: tareas 8 a 10 -->
</main>
```

- [ ] **Step 5: Verificar**

Run: `npm run build`
Expected: build OK; `dist/index.html` contiene "Sin abono" y "Fotos del equipo: muy pronto".

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "Hero, placeholder de producto y franja de credibilidad"
```

---

### Task 8: Sección producto + cómo funciona

**Files:**
- Create: `src/components/Producto.astro`, `src/components/ComoFunciona.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear `src/components/Producto.astro`**

```astro
---
import { producto, nombreProducto } from "../data/producto";
import CtaWhatsapp from "./CtaWhatsapp.astro";
import FotoProducto from "./FotoProducto.astro";

const iconos: Record<string, string> = {
  app: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm5 16h.01",
  video: "M23 7l-7 5 7 5V7ZM1 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7Z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Zm-4.27 13a2 2 0 0 1-3.46 0",
};

const titulo = producto.nombre
  ? `${producto.marca ? producto.marca + " " : ""}${producto.nombre}`
  : "Conocé nuestra nueva alarma automonitoreada";
---

<section id="la-alarma" class="scroll-mt-20">
  <div class="mx-auto grid max-w-6xl items-start gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
    <FotoProducto />
    <div>
      {!producto.disponible && (
        <span class="mb-4 inline-block rounded-full bg-gold-soft px-4 py-1 text-xs font-bold tracking-wide text-navy uppercase">
          Próximamente
        </span>
      )}
      <h2 class="text-3xl font-extrabold tracking-tight text-navy">{titulo}</h2>
      <ul class="mt-8 space-y-6">
        {producto.caracteristicas.map((c) => (
          <li class="flex gap-4">
            <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d={iconos[c.icono]} />
              </svg>
            </span>
            <div>
              <h3 class="font-bold text-navy">{c.titulo}</h3>
              <p class="mt-1 text-sm leading-relaxed text-navy/70">{c.descripcion}</p>
            </div>
          </li>
        ))}
      </ul>
      {producto.especificaciones.length > 0 && (
        <dl class="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl bg-cloud p-5 text-sm">
          {producto.especificaciones.map((e) => (
            <>
              <dt class="font-semibold text-navy/60">{e.etiqueta}</dt>
              <dd class="font-bold text-navy">{e.valor}</dd>
            </>
          ))}
        </dl>
      )}
      {producto.precio && (
        <p class="mt-8 text-3xl font-extrabold text-navy">{producto.precio}</p>
      )}
      <div class="mt-8">
        <CtaWhatsapp texto={producto.disponible ? "Quiero la mía" : "Avisame cuando esté"} grande />
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Crear `src/components/ComoFunciona.astro`**

```astro
---
const pasos = [
  {
    titulo: "La instalamos",
    detalle:
      "Técnicos propios, instalación prolija y garantizada. Te vas con la app configurada y sabiendo usarla.",
  },
  {
    titulo: "La controlás",
    detalle:
      "Desde tu celular: armás, desarmás y ves el estado de tu casa desde cualquier lugar.",
  },
  {
    titulo: "Te avisa al instante",
    detalle:
      "Ante cualquier evento te llega la notificación en el momento. Vos decidís qué hacer, con información real.",
  },
];
---

<section id="como-funciona" class="scroll-mt-20 border-y border-navy/10 bg-cloud">
  <div class="mx-auto max-w-6xl px-4 py-16 md:py-24">
    <h2 class="text-center text-3xl font-extrabold tracking-tight text-navy">
      Así de simple
    </h2>
    <div class="mt-12 grid gap-8 md:grid-cols-3">
      {pasos.map((p, i) => (
        <div class="rounded-2xl bg-white p-7 shadow-sm">
          <span class="flex size-10 items-center justify-center rounded-full bg-gold text-lg font-extrabold text-navy-deep">
            {i + 1}
          </span>
          <h3 class="mt-4 text-lg font-bold text-navy">{p.titulo}</h3>
          <p class="mt-2 text-sm leading-relaxed text-navy/70">{p.detalle}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Sumar `<Producto />` y `<ComoFunciona />` al `<main>`** (después de `<Credibilidad />`).

- [ ] **Step 4: Verificar**

Run: `npm run build`
Expected: build OK; aparece "Conocé nuestra nueva alarma automonitoreada" y el badge "Próximamente".

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Producto reactivo a producto.ts y sección cómo funciona"
```

---

### Task 9: Comparativa + por qué nosotros

**Files:**
- Create: `src/components/Comparativa.astro`, `src/components/PorQueNosotros.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear `src/components/Comparativa.astro`**

La fila "¿A quién le reclamás?" se apoya en la habilitación, no en la dirección (spec §4.6).

```astro
---
import { empresa } from "../data/empresa";

const filas = [
  { concepto: "Abono mensual", kit: "No", mp: "No", multi: "Sí, y aumenta" },
  { concepto: "Instalación", kit: "Te arreglás solo", mp: "Profesional, incluida", multi: "Sí" },
  { concepto: "Garantía y servicio técnico", kit: "—", mp: "Sí, acá en La Plata", multi: "Call center" },
  {
    concepto: "¿A quién le reclamás?",
    kit: "A nadie",
    mp: `A una empresa habilitada, con CUIT y ${empresa.anios} años en la ciudad`,
    multi: "A un call center",
  },
  { concepto: "Habilitación oficial", kit: "No tiene", mp: `Prestadora N° ${empresa.prestadora} (PBA)`, multi: "Sí" },
];
---

<section class="mx-auto max-w-6xl px-4 py-16 md:py-24">
  <h2 class="text-center text-3xl font-extrabold tracking-tight text-navy">
    Comparanos, en serio
  </h2>
  <p class="mx-auto mt-3 max-w-2xl text-center text-navy/70">
    Lo mismo que un kit de internet no te da, y lo mismo que a una multinacional le sobra cobrarte.
  </p>
  <div class="mt-10 overflow-x-auto">
    <table class="w-full min-w-[640px] border-collapse text-sm">
      <thead>
        <tr class="bg-navy text-white">
          <th class="rounded-tl-xl p-4 text-left font-semibold"></th>
          <th class="p-4 font-semibold">Kit de internet</th>
          <th class="bg-gold p-4 font-extrabold text-navy-deep">Máxima Protección</th>
          <th class="rounded-tr-xl p-4 font-semibold">Multinacional</th>
        </tr>
      </thead>
      <tbody>
        {filas.map((f) => (
          <tr class="border-b border-navy/10">
            <th class="p-4 text-left font-bold text-navy">{f.concepto}</th>
            <td class="p-4 text-center text-navy/70">{f.kit}</td>
            <td class="bg-gold-soft p-4 text-center font-bold text-navy">{f.mp}</td>
            <td class="p-4 text-center text-navy/70">{f.multi}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

- [ ] **Step 2: Crear `src/components/PorQueNosotros.astro`**

```astro
---
import { empresa } from "../data/empresa";
---

<section id="por-que-nosotros" class="scroll-mt-20 bg-navy-deep">
  <div class="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
    <div class="mx-auto mb-6 h-1 w-14 rounded bg-gold"></div>
    <h2 class="text-3xl font-extrabold tracking-tight text-white">
      {empresa.anios} años cuidando lo tuyo
    </h2>
    <div class="mt-8 space-y-5 text-left leading-relaxed text-white/80">
      <p>
        Hace más de {empresa.anios} años que hacemos una sola cosa: proteger casas y
        comercios de {empresa.ciudad}. Empezamos cuando las alarmas eran cables y
        sirenas, y fuimos incorporando cada tecnología que valió la pena — siempre
        con el mismo criterio: que funcione cuando de verdad se la necesita.
      </p>
      <p>
        Somos una empresa platense, habilitada por el Ministerio de Seguridad de la
        Provincia de Buenos Aires como prestadora N° {empresa.prestadora}, encuadrada
        en la Ley {empresa.ley} y con los seguros que exige la actividad: vida,
        responsabilidad civil y ART.
      </p>
      <p>
        La alarma automonitoreada es nuestro paso siguiente: la experiencia de
        {empresa.anios} años, en un equipo que te avisa a vos, sin abonos ni
        contratos. Conocemos el rubro por dentro — sabemos exactamente qué tiene que
        tener, y qué no.
      </p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Sumar `<Comparativa />` y `<PorQueNosotros />` al `<main>`**.

- [ ] **Step 4: Verificar**

Run: `npm run build`
Expected: build OK; la tabla aparece con la columna central resaltada.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Comparativa de tres columnas y sección por qué nosotros"
```

---

### Task 10: FAQ + contacto + footer — índice completo

**Files:**
- Create: `src/components/Faq.astro`, `src/components/Contacto.astro`, `src/components/Footer.astro`
- Modify: `src/pages/index.astro` (versión final)

- [ ] **Step 1: Crear `src/components/Faq.astro`**

Incluye la objeción central al automonitoreo, respondida de frente (spec §4.8).

```astro
---
const preguntas = [
  {
    q: "¿De verdad no pago abono?",
    a: "De verdad. El equipo es tuyo y te avisa directamente a tu celular: no hay cuota mensual ni contrato de permanencia.",
  },
  {
    q: "¿Y si no estoy mirando el celular?",
    a: "La alarma no depende de un solo aviso: dispara la sirena en el momento y puede notificar también a las personas que elijas — familia, vecinos, quien quieras. Con la video verificación, apenas tomás el teléfono ves qué pasó: no adivinás. Y si además querés que una central profesional la vigile por vos, también somos empresa de monitoreo: hablemos.",
  },
  {
    q: "¿Qué pasa si se corta la luz o internet?",
    a: "El equipo cuenta con respaldo para seguir funcionando ante cortes. Las especificaciones completas del modelo las publicamos junto con el lanzamiento.",
  },
  {
    q: "¿La instalación es complicada?",
    a: "Para vos, no: la hacen nuestros técnicos, es rápida y prolija, y te vas con la app configurada y sabiendo usarla.",
  },
  {
    q: "¿Sirve para un comercio?",
    a: "Sí. La configuramos a medida para casas, departamentos y comercios de La Plata y alrededores.",
  },
];
---

<section id="preguntas" class="scroll-mt-20 border-y border-navy/10 bg-cloud">
  <div class="mx-auto max-w-3xl px-4 py-16 md:py-24">
    <h2 class="text-center text-3xl font-extrabold tracking-tight text-navy">
      Preguntas frecuentes
    </h2>
    <div class="mt-10 space-y-3">
      {preguntas.map((p) => (
        <details class="group rounded-xl bg-white p-5 shadow-sm">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-navy">
            {p.q}
            <span class="text-gold transition group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p class="mt-3 text-sm leading-relaxed text-navy/70">{p.a}</p>
        </details>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Crear `src/components/Contacto.astro`**

Se adapta a `empresa.ts`: hoy muestra el aviso de renovación + redes; al cargar datos, crecen los bloques solos.

```astro
---
import { empresa } from "../data/empresa";
import CtaWhatsapp from "./CtaWhatsapp.astro";
---

<section id="contacto" class="scroll-mt-20">
  <div class="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
    <h2 class="text-3xl font-extrabold tracking-tight text-navy">Hablemos</h2>
    {
      empresa.whatsapp ? (
        <p class="mt-4 text-navy/70">
          Escribinos y un asesor te responde para armar la mejor solución para tu casa o comercio.
        </p>
      ) : (
        <p class="mt-4 text-navy/70">
          Estamos renovando nuestros canales de atención. Muy pronto vas a poder
          escribirnos por WhatsApp directamente desde acá.
        </p>
      )
    }
    <div class="mt-8">
      <CtaWhatsapp grande />
    </div>
    {
      (empresa.telefono || empresa.direccion || empresa.horario) && (
        <div class="mt-10 grid gap-6 text-sm sm:grid-cols-3">
          {empresa.telefono && (
            <div>
              <h3 class="font-bold text-navy">Teléfono</h3>
              <p class="mt-1 text-navy/70">{empresa.telefono}</p>
            </div>
          )}
          {empresa.direccion && (
            <div>
              <h3 class="font-bold text-navy">Oficina</h3>
              <p class="mt-1 text-navy/70">{empresa.direccion}, {empresa.ciudad}</p>
            </div>
          )}
          {empresa.horario && (
            <div>
              <h3 class="font-bold text-navy">Horario</h3>
              <p class="mt-1 text-navy/70">{empresa.horario}</p>
            </div>
          )}
        </div>
      )
    }
    <p class="mt-10 text-sm font-semibold text-navy/60">Mientras tanto, encontranos en</p>
    <div class="mt-3 flex justify-center gap-4">
      <a href={empresa.redes.facebook} target="_blank" rel="noopener" class="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">Facebook</a>
      <a href={empresa.redes.instagram} target="_blank" rel="noopener" class="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">Instagram</a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Crear `src/components/Footer.astro`**

```astro
---
import { empresa } from "../data/empresa";

const anio = new Date().getFullYear();
---

<footer class="bg-navy-deep text-white/70">
  <div class="mx-auto max-w-6xl space-y-4 px-4 py-10 text-center text-xs leading-relaxed">
    <img src="/images/logo-mp.jpg" alt={empresa.nombreComercial} class="mx-auto h-12 w-auto rounded" loading="lazy" />
    <p>
      {empresa.razonSocial} · CUIT {empresa.cuit}
      <br />
      Prestadora de seguridad privada N° {empresa.prestadora}, habilitada por el
      Ministerio de Seguridad de la Provincia de Buenos Aires · Ley {empresa.ley} ·
      Seguros de vida, responsabilidad civil y ART.
    </p>
    <p>
      <a href={empresa.redes.facebook} target="_blank" rel="noopener" class="underline underline-offset-2 hover:text-white">Facebook</a>
      {" · "}
      <a href={empresa.redes.instagram} target="_blank" rel="noopener" class="underline underline-offset-2 hover:text-white">Instagram</a>
    </p>
    <p>© {anio} {empresa.razonSocial} — {empresa.ciudad}, {empresa.provincia}, Argentina.</p>
  </div>
</footer>
```

- [ ] **Step 4: `src/pages/index.astro` — versión final completa**

```astro
---
import Layout from "../layouts/Layout.astro";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import Credibilidad from "../components/Credibilidad.astro";
import Producto from "../components/Producto.astro";
import ComoFunciona from "../components/ComoFunciona.astro";
import Comparativa from "../components/Comparativa.astro";
import PorQueNosotros from "../components/PorQueNosotros.astro";
import Faq from "../components/Faq.astro";
import Contacto from "../components/Contacto.astro";
import Footer from "../components/Footer.astro";
import BotonWhatsapp from "../components/BotonWhatsapp.astro";
---

<Layout>
  <Header />
  <main>
    <Hero />
    <Credibilidad />
    <Producto />
    <ComoFunciona />
    <Comparativa />
    <PorQueNosotros />
    <Faq />
    <Contacto />
    <Footer />
  </main>
  <BotonWhatsapp />
</Layout>
```

Nota: `<Footer />` va dentro de `<main>`? No — moverlo fuera: `</main>` antes de `<Footer />`. Queda:

```astro
<Layout>
  <Header />
  <main>
    <Hero />
    <Credibilidad />
    <Producto />
    <ComoFunciona />
    <Comparativa />
    <PorQueNosotros />
    <Faq />
    <Contacto />
  </main>
  <Footer />
  <BotonWhatsapp />
</Layout>
```

- [ ] **Step 5: Verificar**

Run: `npm run check && npm run build`
Expected: 0 errores de tipos; build OK con las 10 secciones.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "FAQ, contacto adaptativo y footer legal: landing completa"
```

---

### Task 11: Script de verificación de invariantes

**Files:**
- Create: `scripts/check-dist.mjs`

- [ ] **Step 1: Crear `scripts/check-dist.mjs`**

Verifica sobre el HTML **generado** las reglas que el spec declara innegociables. Modo `--activo` para la prueba de activación (Task 12).

```js
import { readFileSync } from "node:fs";

const activo = process.argv.includes("--activo");
const html = readFileSync("dist/index.html", "utf8");
const fallos = [];
const check = (cond, msg) => cond || fallos.push(msg);

// Datos de contacto viejos: prohibidos siempre (spec §1)
for (const viejo of ["6136661", "4706262", "4792520", "Calle 23", "calle 23"]) {
  check(!html.includes(viejo), `Dato de contacto viejo presente: "${viejo}"`);
}

// Identidad legal: presente siempre
check(html.includes("30-71103275-0"), "Falta el CUIT en el HTML");
check(html.includes("1739"), "Falta el número de prestadora");
check(html.includes("MAXIMA PROTECCION LA PLATA S.A."), "Falta la razón social");

if (activo) {
  check(html.includes("https://wa.me/549"), "Modo activo: falta el enlace wa.me");
  check(!html.includes("· Próximamente"), "Modo activo: quedó un CTA desactivado");
} else {
  check(!html.includes("wa.me"), "Con whatsapp=null no debe haber ningún enlace wa.me");
  check(html.includes("Próximamente"), "Falta el estado Próximamente en los CTA");
  check(html.includes('"@type":"Organization"'), "Sin dirección el JSON-LD debe ser Organization");
  check(!html.includes('"@type":"LocalBusiness"'), "Sin dirección no debe declararse LocalBusiness");
}

if (fallos.length > 0) {
  console.error("check-dist: FALLÓ\n- " + fallos.join("\n- "));
  process.exit(1);
}
console.log(`check-dist: OK (modo ${activo ? "activo" : "placeholder"})`);
```

- [ ] **Step 2: Correr la verificación en modo placeholder**

Run: `npm run verify`
Expected: `check-dist: OK (modo placeholder)`.

- [ ] **Step 3: Commit**

```bash
git add scripts/check-dist.mjs && git commit -m "check-dist: invariantes del spec verificadas sobre el HTML generado"
```

---

### Task 12: Prueba de activación (spec §6) + README

**Files:**
- Modify (temporal, se revierte): `src/data/empresa.ts`, `src/data/producto.ts`
- Create: `README.md`

- [ ] **Step 1: Activar datos de prueba temporalmente**

En `empresa.ts`: `whatsapp: "2211234567"`. En `producto.ts`: `disponible: true`, `nombre: "Modelo de Prueba"`.

- [ ] **Step 2: Verificar el modo activo**

Run: `npm run build && node scripts/check-dist.mjs --activo`
Expected: `check-dist: OK (modo activo)`. Esto prueba que completar los datos activa el sitio sin tocar componentes.

- [ ] **Step 3: Revertir los datos de prueba**

Run: `git checkout -- src/data/empresa.ts src/data/producto.ts && npm run verify`
Expected: `check-dist: OK (modo placeholder)` — el sitio vuelve a su estado real.

- [ ] **Step 4: Crear `README.md`**

```markdown
# Máxima Protección — Sitio web

Landing estática de la alarma automonitoreada. Astro 5 + Tailwind 4.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local en http://localhost:4321 |
| `npm run build` | Genera el sitio en `dist/` |
| `npm run test` | Tests de la lógica (Vitest) |
| `npm run verify` | Build + verificación de invariantes del HTML |

## Cómo cargar los datos que faltan

**Todo el contenido variable vive en `src/data/`. No hay que tocar componentes.**

### Cuando llegue el producto (`src/data/producto.ts`)
1. Copiar las fotos a `public/images/producto/` y listarlas en `fotos`.
2. Completar `nombre`, `marca`, `especificaciones` y `precio`.
3. Poner `disponible: true` (desaparece el "Próximamente").

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
```

- [ ] **Step 5: Commit**

```bash
git add README.md && git commit -m "README: cómo cargar producto y contacto; checklist de publicación"
```

---

### Task 13: Verificación visual final

- [ ] **Step 1:** `npm run dev` y revisar en el navegador (desktop + emulación móvil 375px): header sticky, anclas, CTA desactivados visibles con "Próximamente", placeholder de fotos digno, tabla con scroll horizontal en móvil, FAQ desplegables, sin datos de contacto viejos a la vista.
- [ ] **Step 2:** `npm run test && npm run verify` — todo en verde.
- [ ] **Step 3:** Push final: `git push origin main`.

---

## Self-review (hecho al escribir el plan)

- **Cobertura del spec:** §2 stack ✓ (T1), §3 datos reactivos ✓ (T2, T6-T8, T11-T12), §4 las 10 secciones ✓ (T6-T10), §5 SEO ✓ (T1 robots/sitemap, T5 Layout/JSON-LD), §6 verificación ✓ (T11-T13, la prueba de activación es T12). La limpieza de Search Console y el deploy al dominio quedan fuera del plan: requieren accesos del cliente (spec §7/§8).
- **Placeholders:** ninguno — todo el código está completo en cada tarea.
- **Consistencia de tipos:** `Empresa`/`Producto` definidos en T2 coinciden con los usos en T5-T10; `waHref(string|null)` coincide con `empresa.whatsapp: string|null`.
