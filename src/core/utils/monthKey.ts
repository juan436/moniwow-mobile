/**
 * monthKey — Util de dominio
 *
 * @what     Traduce una fecha al mes que la contiene, 'YYYY-MM'.
 * @receives date: Date
 * @processes Nada de negocio: es la identidad de un mes en todo el proyecto. Una cuota de julio, una
 *           ocurrencia de julio y la columna de julio del barChart usan esta misma cadena, así que
 *           tiene que salir de un solo sitio.
 * @returns  'YYYY-MM'
 *
 * Vivía dentro de `ComputeMonthlyTotals`, que se fue al servidor. No se subió con él porque no es un
 * cálculo de dinero: es formato de fecha, y lo siguen necesitando los dos use-cases de cancelación
 * que aún viven acá.
 */
export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}
