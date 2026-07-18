// Catálogo de accesorios Zenity Smart compatibles con el panel ZN10 PRO.
// `precio` es el precio FINAL de venta al público, en pesos argentinos.
// Los items con stock "sin-stock" no se muestran en el sitio.

export type Stock = "stock" | "consultar" | "sin-stock";

export interface Accesorio {
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: number;
  stock: Stock;
}

export const accesorios: Accesorio[] = [
  // Sensores
  {
    codigo: "CP-D02",
    nombre: "Sensor de apertura",
    categoria: "Sensores",
    descripcion:
      "Para puertas y ventanas. Batería de hasta 5 años, aviso de apertura, cierre y manipulación.",
    precio: 31500,
    stock: "stock",
  },
  {
    codigo: "CP-P30",
    nombre: "Detector de movimiento",
    categoria: "Sensores",
    descripcion:
      "Interior, con ángulo de 110°. Tiempo de disparo configurable y batería fácil de reemplazar.",
    precio: 37800,
    stock: "stock",
  },
  {
    codigo: "ZN-EXTERIOR",
    nombre: "Sensor de movimiento exterior",
    categoria: "Sensores",
    descripcion: "Alcance de 12 m × 110°, apto mascotas. Funciona con 2 pilas AA.",
    precio: 94500,
    stock: "stock",
  },
  {
    codigo: "ZN-V01",
    nombre: "Sensor de vibración y vidrio",
    categoria: "Sensores",
    descripcion: "Detecta golpes y rotura de vidrio, con sensibilidad ajustable.",
    precio: 31500,
    stock: "stock",
  },
  {
    codigo: "SS010",
    nombre: "Sensor de cortina",
    categoria: "Sensores",
    descripcion: "Incluye receptor. Protege ventanales y frentes vidriados.",
    precio: 33600,
    stock: "stock",
  },
  {
    codigo: "CP-S20",
    nombre: "Sensor de humo",
    categoria: "Sensores",
    descripcion: "Autónomo, con sirena propia.",
    precio: 17640,
    stock: "stock",
  },

  // Controles
  {
    codigo: "CP-R01",
    nombre: "Control remoto",
    categoria: "Controles",
    descripcion: "Para armar y desarmar sin el celular. Disponible en blanco o negro.",
    precio: 10500,
    stock: "stock",
  },
  {
    codigo: "CP-K01-L",
    nombre: "Teclado inalámbrico",
    categoria: "Controles",
    descripcion: "Alcance de hasta 100 m, batería recargable integrada.",
    precio: 60900,
    stock: "stock",
  },
  {
    codigo: "CP-SOS",
    nombre: "Botón S.O.S.",
    categoria: "Controles",
    descripcion: "Aviso inmediato con un solo botón. Ideal para personas mayores o comercios.",
    precio: 14700,
    stock: "stock",
  },
  {
    codigo: "CP-B10",
    nombre: "Timbre inteligente",
    categoria: "Controles",
    descripcion: "Compatible con el sistema Zenity Smart.",
    precio: 14700,
    stock: "stock",
  },

  // Sirenas
  {
    codigo: "CP-SN30-L",
    nombre: "Sirena exterior solar",
    categoria: "Sirenas",
    descripcion:
      "Inalámbrica, hasta 120 dB con volumen ajustable. Resistente al agua, batería de 5000 mAh y carga solar opcional.",
    precio: 132300,
    stock: "stock",
  },
  {
    codigo: "ZN12-ZN",
    nombre: "Sirena inalámbrica solar",
    categoria: "Sirenas",
    descripcion: "Con panel solar incorporado.",
    precio: 94500,
    stock: "sin-stock",
  },

  // Protección perimetral
  {
    codigo: "SL100-BATERIA",
    nombre: "Barrera perimetral a batería",
    categoria: "Protección perimetral",
    descripcion: "Inalámbrica, cubre hasta 60 m. Detecta el intruso antes de que entre.",
    precio: 252000,
    stock: "stock",
  },
  {
    codigo: "SL100-SOLAR",
    nombre: "Barrera perimetral solar",
    categoria: "Protección perimetral",
    descripcion: "Inalámbrica con panel solar, cubre hasta 100 m.",
    precio: 315000,
    stock: "consultar",
  },

  // Ampliación e instalación
  {
    codigo: "ZN-RW16",
    nombre: "Receptor de zonas cableadas",
    categoria: "Ampliación e instalación",
    descripcion: "Suma 16 zonas cableadas al panel.",
    precio: 102900,
    stock: "stock",
  },
  {
    codigo: "REL-ZENITY",
    nombre: "Relay para sirenas cableadas",
    categoria: "Ampliación e instalación",
    descripcion: "Conecta sirenas cableadas al panel Zenity.",
    precio: 12180,
    stock: "stock",
  },
  {
    codigo: "ZN-EX010",
    nombre: "Repetidor de señal",
    categoria: "Ampliación e instalación",
    descripcion: "Amplía el alcance de los sensores en casas grandes o de varios pisos.",
    precio: 115500,
    stock: "stock",
  },
];

/** Categorías en el orden en que se muestran. */
export const categorias = [
  "Sensores",
  "Controles",
  "Sirenas",
  "Protección perimetral",
  "Ampliación e instalación",
];
