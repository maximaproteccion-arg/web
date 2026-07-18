/** Formatea un monto en pesos argentinos: 304500 → "$304.500". */
export function fmtPesos(monto: number): string {
  return "$" + monto.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
