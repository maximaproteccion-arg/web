# Conectar maximaproteccion.com.ar

Guía para publicar el sitio en el dominio propio. Tres pasos: activar el
despliegue, cargar el DNS en NIC.ar, y activar HTTPS.

El sitio se sirve desde **GitHub Pages** con el repo `maximaproteccion-arg/web`.
Cada push a `main` construye y despliega solo (workflow `.github/workflows/deploy.yml`),
y el despliegue falla si los tests o las invariantes de contenido no pasan.

---

## Antes de empezar: qué se hace público

Al completar el paso 2, el sitio queda visible para cualquiera y Google puede
empezar a indexarlo. Conviene revisar:

- [ ] **WhatsApp cargado en `src/data/empresa.ts`.** Si sigue en `null`, los
      botones dicen "Próximamente" y **el sitio no puede recibir consultas**.
      Es la única vía de conversión.
- [ ] **Habilitación N° 1739 vigente.** El sitio la afirma en varios lugares.
- [ ] **Google Search Console** dado de alta para limpiar el rastro del hackeo
      del sitio anterior (paso 4).

---

## Paso 1 — Activar GitHub Pages (una sola vez)

Con la cuenta **maximaproteccion-arg**, en el repo `web`:

1. **Settings → Pages**
2. En *Build and deployment* → *Source*, elegir **GitHub Actions**
3. Listo. No hace falta elegir rama.

Después, en **Actions**, verificar que el workflow "Desplegar sitio" corrió en
verde. La primera vez puede requerir aprobar la ejecución de workflows.

---

## Paso 2 — Cargar el DNS en NIC.ar

Entrar a [nic.ar](https://nic.ar) con Clave Fiscal → **Mis dominios** →
`maximaproteccion.com.ar` → administrar DNS / editar zona.

Cargar estos registros:

### Dominio raíz (`maximaproteccion.com.ar`) — 4 registros tipo A

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` (o vacío) | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Son las cuatro IPs de GitHub Pages. Van las cuatro: si una se cae, el sitio
sigue funcionando por las otras.

### `www` — 1 registro tipo CNAME

| Tipo | Nombre | Valor |
|---|---|---|
| CNAME | `www` | `maximaproteccion-arg.github.io.` |

(con el punto final, si el panel lo pide)

Así `www.maximaproteccion.com.ar` redirige solo al dominio sin www, que es el
que queda como dirección oficial — es el que tenía el sitio anterior y el que
Google ya conoce.

### Opcional: IPv6 — 4 registros tipo AAAA

| Tipo | Nombre | Valor |
|---|---|---|
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

**Si el panel de NIC.ar no permite cargar registros A/CNAME**, hay que delegar el
dominio a un DNS externo gratuito (Cloudflare es el estándar) y cargar los mismos
registros ahí. Es un paso más, pero después la administración es más simple.

La propagación tarda entre unos minutos y 24 horas.

---

## Paso 3 — Activar HTTPS

Cuando el DNS haya propagado, volver a **Settings → Pages** del repo:

1. En *Custom domain* aparece `maximaproteccion.com.ar` (lo declara el workflow).
   Debe mostrar un tilde verde de verificación.
2. Marcar **Enforce HTTPS**.

El certificado lo emite GitHub gratis y se renueva solo. Si la casilla aparece
gris, esperar a que termine de propagar el DNS y recargar.

---

## Paso 4 — Limpiar el rastro del hackeo

El dominio sirvió spam de apuestas antes de que el hosting lo suspendiera. Ese
contenido puede seguir indexado en Google y arrastrar la reputación del dominio.

1. Dar de alta el dominio en [Google Search Console](https://search.google.com/search-console)
   (verificación por registro TXT en NIC.ar).
2. Enviar el sitemap: `https://maximaproteccion.com.ar/sitemap-index.xml`
3. En *Seguridad y acciones manuales*, revisar si hay alguna marca por contenido
   comprometido y pedir la revisión.
4. Las URLs viejas de spam devuelven 404 solas (ya no existen), que es lo que
   Google necesita para desindexarlas.

---

## Después de publicar

- Dar de baja el preview `lexagisargentina.github.io` (repo personal, ya no hace
  falta y conviene que no quede una copia dando vueltas).
- Actualizar las redes sociales con la dirección nueva.
