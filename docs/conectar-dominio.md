# Conectar maximaproteccion.com.ar

El sitio se despliega en **Vercel**, conectado al repo `maximaproteccion-arg/web`.
Cada push a `main` construye y publica solo; cada rama genera un preview.

El build corre `npm run test && npm run build && node scripts/check-dist.mjs`
(definido en `vercel.json`), así que **si los tests fallan, o si reaparecen la
marca del proveedor, un precio o los datos de contacto viejos, el deploy se
aborta y no publica nada**.

---

## Antes de conectar el dominio: qué se hace público

Al apuntar el DNS, el sitio queda visible y Google puede indexarlo. Revisar:

- [ ] **WhatsApp cargado en `src/data/empresa.ts`.** Si sigue en `null`, los
      botones dicen "Próximamente" y **el sitio no puede recibir consultas**.
      Es la única vía de conversión.
- [ ] **Habilitación N° 1739 vigente.** El sitio la afirma en varios lugares.
- [ ] **Google Search Console** para limpiar el rastro del hackeo (paso 3).

---

## Paso 1 — Agregar el dominio en Vercel

En el panel de Vercel, proyecto **web**:

1. **Settings → Domains**
2. Agregar `maximaproteccion.com.ar`
3. Agregar también `www.maximaproteccion.com.ar` y dejarlo **redirigiendo** al
   dominio sin www.

Se usa el dominio **sin www** como dirección oficial: es la que tenía el sitio
anterior y la que Google ya conoce, así se conserva la antigüedad del dominio.

Al agregarlo, **Vercel muestra en pantalla los registros DNS exactos que hay que
cargar**. Usar esos valores: Vercel los asigna por proyecto y son la fuente
autoritativa. Los del paso 2 son la referencia habitual.

---

## Paso 2 — Cargar el DNS en NIC.ar

Entrar a [nic.ar](https://nic.ar) con Clave Fiscal → **Mis dominios** →
`maximaproteccion.com.ar` → administrar DNS / editar zona.

Cargar lo que indique Vercel, que normalmente es:

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` (o vacío) | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

**Verificar siempre contra lo que muestra el panel de Vercel** antes de guardar.

**Si NIC.ar no permite cargar registros A/CNAME**, hay que delegar el dominio a
un DNS externo gratuito (Cloudflare es el estándar) cambiando los nameservers, y
cargar los mismos registros ahí.

La propagación tarda entre unos minutos y 24 horas. Vercel emite el certificado
HTTPS solo, apenas detecta el dominio apuntado.

---

## Paso 3 — Limpiar el rastro del hackeo

El dominio sirvió spam de apuestas antes de que el hosting anterior lo
suspendiera. Ese contenido puede seguir indexado y arrastrar la reputación.

1. Dar de alta el dominio en [Google Search Console](https://search.google.com/search-console)
   (verificación por registro TXT en NIC.ar).
2. Enviar el sitemap: `https://maximaproteccion.com.ar/sitemap-index.xml`
3. En *Seguridad y acciones manuales*, revisar si hay alguna marca por contenido
   comprometido y pedir la revisión.
4. Las URLs viejas de spam ya no existen y devuelven 404, que es lo que Google
   necesita para desindexarlas.

---

## Después de publicar

- Dar de baja el preview `lexagisargentina.github.io` (repo personal; conviene
  que no quede una copia del sitio dando vueltas).
- Actualizar las redes sociales con la dirección nueva.

---

## Notas técnicas

- `vercel.json` define el build, las cabeceras de seguridad (HSTS, nosniff,
  frame-options, referrer-policy, permissions-policy, CSP) y el cacheo
  inmutable de los assets con hash.
- El CSP permite scripts y estilos inline porque Astro incrusta el JSON-LD que
  lee Google y el script del menú móvil. No es un riesgo relevante acá: el sitio
  es estático, sin formularios, sin login y sin contenido de terceros.
