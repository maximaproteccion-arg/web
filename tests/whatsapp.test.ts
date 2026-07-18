import { describe, expect, it } from "vitest";
import { MENSAJE_WHATSAPP, waHref } from "../src/lib/whatsapp";

describe("waHref", () => {
  it("devuelve null sin número — jamás un enlace roto", () => {
    expect(waHref(null)).toBeNull();
    expect(waHref("")).toBeNull();
    expect(waHref("  ")).toBeNull();
  });

  it("arma el enlace wa.me con 549 y el mensaje precargado", () => {
    const href = waHref("2211234567");
    expect(href).toBe(
      `https://wa.me/5492211234567?text=${encodeURIComponent(MENSAJE_WHATSAPP)}`,
    );
  });

  it("normaliza formatos con espacios, guiones, 0 inicial y prefijos 54/549", () => {
    const esperado = waHref("2211234567");
    expect(waHref("0221 123-4567")).toBe(esperado);
    expect(waHref("+54 9 221 123 4567")).toBe(esperado);
    expect(waHref("54 221 123 4567")).toBe(esperado);
  });

  it("acepta mensaje personalizado", () => {
    expect(waHref("2211234567", "Hola")).toContain("text=Hola");
  });
});
