import { describe, expect, it } from "vitest";
import { fmtPesos } from "../src/lib/precios";

describe("fmtPesos", () => {
  it("separa miles con punto, formato argentino", () => {
    expect(fmtPesos(304500)).toBe("$304.500");
    expect(fmtPesos(10500)).toBe("$10.500");
    expect(fmtPesos(1234567)).toBe("$1.234.567");
  });

  it("no agrega separador en montos chicos", () => {
    expect(fmtPesos(900)).toBe("$900");
  });
});
