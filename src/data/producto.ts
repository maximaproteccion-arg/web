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
  precio: string | null;
}

export const producto: Producto = {
  // Cuando llegue el modelo real: completar estos campos y nada más.
  // Ningún componente hace falta tocar.
  disponible: false,
  nombre: null,
  marca: null,
  fotos: [],
  caracteristicas: [
    {
      icono: "app",
      titulo: "Controlala desde tu celular",
      descripcion:
        "Armás, desarmás y ves el estado de tu alarma desde la app, estés donde estés.",
    },
    {
      icono: "video",
      titulo: "Video verificación",
      descripcion:
        "Cuando algo pasa, lo ves: mirá tu propiedad en vivo desde el teléfono.",
    },
    {
      icono: "bell",
      titulo: "Aviso instantáneo",
      descripcion:
        "Notificación en el momento ante cualquier evento. Sin intermediarios.",
    },
  ],
  especificaciones: [],
  precio: null,
};

export function nombreProducto(p: Producto): string {
  return p.nombre ?? "nuestra nueva alarma automonitoreada";
}
