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
