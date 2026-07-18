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
  disponible: true,
  nombre: "ZN10 PRO",
  marca: "Zenity Smart",
  fotos: [
    "/images/producto/kit-zn10-pro.webp",
    "/images/producto/sensor-puerta-cp-d02.jpg",
  ],
  caracteristicas: [
    {
      icono: "app",
      titulo: "Controlala desde tu celular",
      descripcion:
        "Armás, desarmás y ves todo desde la app Tuya Smart, estés donde estés. Compatible con Google Home y Alexa para control por voz.",
    },
    {
      icono: "video",
      titulo: "Sumale cámaras en la misma app",
      descripcion:
        "Se integra con cámaras compatibles Tuya: mirás tu propiedad en vivo desde la misma aplicación con la que manejás la alarma.",
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
  precio: "$304.500",
};

export function nombreProducto(p: Producto): string {
  return p.nombre ?? "nuestra nueva alarma automonitoreada";
}
