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
    logo: `${e.dominio}/images/logo-maxima-proteccion.webp`,
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
