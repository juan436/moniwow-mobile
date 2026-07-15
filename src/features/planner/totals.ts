/**
 * totals — Planner Feature
 *
 * @what     Totales del hero de Mi Mes, derivados de los ítems de la Agenda.
 * @receives items: AgendaItemDisplay[]
 * @processes El hero mostraba la suma de **todo** el filtro, pagado o no: confirmabas la renta y el
 *           número no se movía. Ahora `pending` es **lo que te queda** — pagar lo baja — y `paid` es
 *           lo ya confirmado, para el contador de progreso.
 *           Los totales son la suma de la lista, nunca un número guardado aparte (antes eran tres
 *           literales escritos a mano en el mock que nadie recalculaba).
 * @returns  Record<AgendaFilter, FilterTotals>
 */
import type { AgendaFilter, AgendaItemDisplay, FilterTotals } from './types';

const FILTERS: AgendaFilter[] = ['gastos', 'ingresos', 'deudas'];

function totalsFor(items: AgendaItemDisplay[]): FilterTotals {
  const done = items.filter((i) => i.isPaid);

  return {
    pending:   items.filter((i) => !i.isPaid).reduce((sum, i) => sum + i.amount, 0),
    paid:      done.reduce((sum, i) => sum + i.amount, 0),
    count:     items.length,
    paidCount: done.length,
  };
}

export function computeTotals(items: AgendaItemDisplay[]): Record<AgendaFilter, FilterTotals> {
  const byFilter = FILTERS.map((filter): [AgendaFilter, FilterTotals] => [
    filter,
    totalsFor(items.filter((i) => i.filter === filter)),
  ]);

  return Object.fromEntries(byFilter) as Record<AgendaFilter, FilterTotals>;
}
