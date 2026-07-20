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

## Paso 2 — Delegar el dominio en NIC.ar

**NIC.ar no permite cargar registros A ni CNAME.** Solo hace *delegación*: se le
indica qué servidores de nombres (nameservers) mandan sobre el dominio, y esos
servidores son los que después resuelven los registros.

Por eso el registro `A → 216.198.79.1` que muestra Vercel **no se carga en
NIC.ar**. Se delega el dominio a Vercel y Vercel crea ese registro solo.

En [nic.ar](https://nic.ar) → **Mis dominios** → `maximaproteccion.com.ar` →
**Delegaciones** → *Agregar una nueva delegación*, cargar dos entradas:

| Host | IPv4 | IPv6 |
|---|---|---|
| `ns1.vercel-dns.com` | *(vacío)* | *(vacío)* |
| `ns2.vercel-dns.com` | *(vacío)* | *(vacío)* |

Guardar cada una con el ícono de diskette y después **EJECUTAR CAMBIOS**.

Los campos IPv4/IPv6 se dejan vacíos: solo hacen falta cuando el nameserver
pertenece al mismo dominio que se delega, que no es el caso. Si el formulario
los exigiera, los valores verificados son `198.51.44.13` y `198.51.45.13`
respectivamente.

La propagación tarda entre unos minutos y 24 horas. Cuando termine, Vercel pasa
de "Invalid Configuration" a válido y emite el certificado HTTPS solo.

### Consecuencia a tener en cuenta

Al delegar a Vercel, **toda la zona DNS pasa a administrarse desde Vercel**
(Settings → Domains → Vercel DNS). Si más adelante se configura el email
corporativo `contacto@maximaproteccion.com.ar`, los registros MX se cargan ahí,
no en NIC.ar.

La alternativa es delegar a Cloudflare (nameservers propios, panel DNS más
completo y gratis) y cargar ahí el registro A que pide Vercel. Es un paso más,
pero conviene si se va a manejar email además del sitio.

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
