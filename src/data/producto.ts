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
  precio: string | null; // precio FINAL de venta al público
}

export const producto: Producto = {
  // Marca, modelo y precios NO se publican (decisión comercial 18/07/2026):
  // se destacan las funcionalidades para que el cliente consulte, sin poder
  // comparar el equipo por su cuenta. Datos internos: fuera del repo.
  disponible: true,
  nombre: null,
  marca: null,
  fotos: ["/images/producto/alarma-kit.webp"],
  caracteristicas: [
    {
      icono: "app",
      titulo: "Controlala desde tu celular",
      descripcion:
        "Armás, desarmás y ves todo desde la app en tu teléfono, estés donde estés. Compatible con Google Home y Alexa para control por voz.",
    },
    {
      icono: "video",
      titulo: "Sumale cámaras en la misma app",
      descripcion:
        "Se integra con cámaras compatibles: mirás tu propiedad en vivo desde la misma aplicación con la que manejás la alarma.",
    },
    {
      icono: "bell",
      titulo: "Te avisa aunque se corte internet",
      descripcion:
        "Notificación instantánea en el celular y, con chip 4G, también por SMS o llamada. Batería de respaldo de 5000 mAh para seguir protegiendo sin luz.",
    },
  ],
  especificaciones: [
    { etiqueta: "Pantalla", valor: 'Táctil IPS 7" (1024×600)' },
    { etiqueta: "Conectividad", valor: "WiFi + LoRa 433 MHz + chip 4G" },
    { etiqueta: "Alcance de sensores", valor: "Hasta 500 m (LoRa)" },
    { etiqueta: "Sirena integrada", valor: "115 dB" },
    { etiqueta: "Batería de respaldo", valor: "Litio 5000 mAh" },
    { etiqueta: "Capacidad", valor: "200 accesorios + 8 zonas cableadas" },
    { etiqueta: "Control por voz", valor: "Google Home y Alexa" },
    { etiqueta: "Actualizaciones", valor: "OTA, 10 idiomas" },
  ],
  precio: null, // los precios se informan por WhatsApp, no se publican
};

export function nombreProducto(p: Producto): string {
  return p.nombre ?? "nuestra nueva alarma automonitoreada";
}
