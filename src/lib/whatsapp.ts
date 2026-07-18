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
