/**
 * recurringFormHelpers — Utilidad
 *
 * @what     Funciones puras compartidas por Create/EditRecurringModal: estado inicial del
 *           formulario y cálculo del día que se persiste (`CreateRecurringData.day`).
 * @receives N/A — funciones puras, sin estado propio.
 * @processes `primaryDay` resuelve el día real a guardar. Deuda Recurrente e Ingreso (multi-día):
 *           primer día de `diasFijos`. Deuda Personalizada: primer día del primer mes con
 *           selección. Gasto: `form.dia` directo (un solo día).
 * @returns  emptyForm/formFromItem: RecurringForm inicial. primaryDay: number.
 */
import type { AgendaFilter, RecurringForm, RecurringDisplay } from '../../types';

export function emptyRecurringForm(tipo: AgendaFilter): RecurringForm {
  return { tipo, nombre: '', monto: '', dia: 1, mes: 1, frecuencia: 'indefinido', modoFecha: 'recurrente', diasFijos: [], diasPorMes: {}, cuotasTotales: 12, cuotasPagadas: 0, jarra: 'libre' };
}

export function recurringFormFromItem(item: RecurringDisplay): RecurringForm {
  return { tipo: item.filter, nombre: item.name, monto: item.amount.toString(), dia: item.day, mes: 1, frecuencia: 'indefinido', modoFecha: 'recurrente', diasFijos: [], diasPorMes: {}, cuotasTotales: 12, cuotasPagadas: 0, jarra: 'libre' };
}

export function resetOnTipoChange(prev: RecurringForm, tipo: AgendaFilter): RecurringForm {
  return { ...prev, tipo, nombre: '', monto: '', frecuencia: 'indefinido', modoFecha: 'recurrente', diasFijos: [], diasPorMes: {}, cuotasTotales: 12, cuotasPagadas: 0 };
}

export function primaryDay(form: RecurringForm): number {
  if (form.tipo === 'ingresos') return form.diasFijos[0] ?? form.dia;
  if (form.tipo !== 'deudas') return form.dia;
  if (form.modoFecha === 'recurrente') return form.diasFijos[0] ?? form.dia;
  const meses = Object.keys(form.diasPorMes).map(Number).sort((a, b) => a - b);
  for (const m of meses) {
    const dias = form.diasPorMes[m];
    if (dias?.length) return dias[0];
  }
  return form.dia;
}
