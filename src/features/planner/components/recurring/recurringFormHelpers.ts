/**
 * recurringFormHelpers — Utilidad
 *
 * @what     Funciones puras compartidas por Create/EditRecurringSheet: estado inicial del
 *           formulario y reset al cambiar de tipo.
 * @receives N/A — funciones puras, sin estado propio.
 * @processes `unicoPago` arranca en `true`: el caso corriente de una deuda es deberle algo a
 *           alguien y pagarlo de una vez. Se desmarca para una deuda a plazos.
 *           Murió `primaryDay`: resolvía "qué día guardar" cuando el picker devolvía varios y había
 *           que quedarse con uno — la pantalla prometía multi-día y el modelo guarda uno solo. Hoy
 *           el picker es de un día para los tres tipos, así que el día es `form.dia` y punto.
 *           Ver [[planes/fechas-y-quincenal]] y [[planes/deuda-simple-y-cuotas]].
 * @returns  RecurringForm inicial.
 */
import type { AgendaFilter, RecurringForm, RecurringDisplay } from '../../types';
import type { JarOption } from '@features/transactions/types';

/** Jarra por defecto: Libre por `type` (no por id — los ids son UUID, no literales). Mismo criterio que `useQuickAdd`. */
export function defaultJarId(jars: JarOption[]): string {
  return jars.find((j) => j.type === 'libre')?.id ?? jars[0]?.id ?? '';
}

export function emptyRecurringForm(tipo: AgendaFilter, jars: JarOption[]): RecurringForm {
  return { tipo, nombre: '', monto: '', dia: 1, frecuencia: 'indefinido', unicoPago: true, cuotasTotales: 12, cuotasPagadas: 0, jarra: defaultJarId(jars) };
}

export function recurringFormFromItem(item: RecurringDisplay): RecurringForm {
  return { tipo: item.filter, nombre: item.name, monto: item.amount.toString(), dia: item.day, frecuencia: item.frecuencia, unicoPago: item.cuotas <= 1, cuotasTotales: item.cuotas, cuotasPagadas: 0, jarra: item.jarra };
}

export function resetOnTipoChange(prev: RecurringForm, tipo: AgendaFilter): RecurringForm {
  return { ...prev, tipo, nombre: '', monto: '', frecuencia: 'indefinido', unicoPago: true, cuotasTotales: 12, cuotasPagadas: 0 };
}
