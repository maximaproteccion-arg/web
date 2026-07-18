import { describe, expect, it } from "vitest";
import { empresa } from "../src/data/empresa";
import { datosEstructurados } from "../src/lib/jsonld";

describe("datosEstructurados", () => {
  it("sin dirección es Organization y no declara address ni telephone", () => {
    const d = datosEstructurados({ ...empresa, direccion: null });
    expect(d["@type"]).toBe("Organization");
    expect(d).not.toHaveProperty("address");
    expect(d).not.toHaveProperty("telephone");
  });

  it("con dirección asciende a LocalBusiness con PostalAddress", () => {
    const d = datosEstructurados({ ...empresa, direccion: "Calle Falsa 123" });
    expect(d["@type"]).toBe("LocalBusiness");
    expect(d.address).toMatchObject({
      "@type": "PostalAddress",
      streetAddress: "Calle Falsa 123",
      addressLocality: "La Plata",
      addressCountry: "AR",
    });
  });

  it("incluye telephone y openingHours solo si existen", () => {
    const base = { ...empresa, direccion: "Calle Falsa 123" };
    expect(datosEstructurados(base)).not.toHaveProperty("telephone");
    const d = datosEstructurados({
      ...base,
      telefono: "2210000000",
      horario: "Mo-Fr 09:00-17:00",
    });
    expect(d.telephone).toBe("2210000000");
    expect(d.openingHours).toBe("Mo-Fr 09:00-17:00");
  });

  it("siempre lleva identidad legal y redes", () => {
    const d = datosEstructurados(empresa);
    expect(d.legalName).toBe("MAXIMA PROTECCION LA PLATA S.A.");
    expect(d.taxID).toBe("30-71103275-0");
    expect(d.sameAs).toEqual([empresa.redes.facebook, empresa.redes.instagram]);
  });
});
