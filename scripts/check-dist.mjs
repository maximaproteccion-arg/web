import { readFileSync } from "node:fs";

const activo = process.argv.includes("--activo");
const html = readFileSync("dist/index.html", "utf8");
const fallos = [];
const check = (cond, msg) => cond || fallos.push(msg);

// Datos de contacto viejos: prohibidos siempre (spec §1)
for (const viejo of ["6136661", "4706262", "4792520", "Calle 23", "calle 23"]) {
  check(!html.includes(viejo), `Dato de contacto viejo presente: "${viejo}"`);
}

// Marca, modelo, códigos del proveedor y ecosistema: JAMÁS deben publicarse.
// Decisión comercial: solo funcionalidades, para que el cliente no compare
// el equipo por su cuenta.
for (const patron of [/zenity/i, /zn10/i, /tuya/i, /sl100/i, /CP-/, /ZN-/]) {
  check(!patron.test(html), `Marca o modelo del proveedor publicado: ${patron}`);
}

// Precios: no se publica ninguno; se informan por WhatsApp.
check(!/\$\s?\d/.test(html), "Hay un precio publicado en el HTML");

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
  check(
    html.includes('"@type":"Organization"'),
    "Sin dirección el JSON-LD debe ser Organization",
  );
  check(
    !html.includes('"@type":"LocalBusiness"'),
    "Sin dirección no debe declararse LocalBusiness",
  );
}

if (fallos.length > 0) {
  console.error("check-dist: FALLÓ\n- " + fallos.join("\n- "));
  process.exit(1);
}
console.log(`check-dist: OK (modo ${activo ? "activo" : "placeholder"})`);
