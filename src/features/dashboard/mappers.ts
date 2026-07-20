/**
 * mappers — Dashboard Feature
 *
 * @what     Traduce un compromiso del dominio al renglón de "Próximos" del Dashboard.
 * @receives commitment: UpcomingCommitment · jar: JarPresentation · today: Date
 * @processes `urgency` es **texto para leer**; `isUrgent` es **el dato**. Antes no existía `isUrgent` y
 *           los componentes deducían la urgencia parseando la frase: `urgency.startsWith('En 1')`,
 *           que pintaba en naranja "En 12 días", "En 15 días" y "En 19 días". Un texto de UI no es
 *           un dato: se traduce, se acorta, cambia — y la lógica que lo lee se rompe en silencio.
 *           El ícono sale de la JARRA que paga, igual que en la Agenda.
 * @returns  UpcomingExpense
 */
import type { UpcomingCommitment } from '@core/types/Summary';
import type { JarPresentation } from '@shared/styles';
import type { UpcomingExpense } from './types';

const MS_PER_DAY = 86_400_000;
const URGENT_DAYS = 1; // hoy, mañana o ya vencido

/** Días de calendario entre hoy y el vencimiento (ignora la hora: 23:59 de hoy sigue siendo "hoy"). */
function daysUntil(dueDate: Date, today: Date): number {
  const due   = Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((due - start) / MS_PER_DAY);
}

// Una fecha pasada significa cosas distintas según de quién dependa: si es tuya, la debes; si es de
// otro, es él quien no ha pagado.
function urgencyLabel(days: number, isIncome: boolean): string {
  if (days < 0)   return isIncome ? 'Aún no llega' : 'Atrasado';
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  return `En ${days} días`;
}

export function toUpcomingExpense(commitment: UpcomingCommitment, jar: JarPresentation, today: Date): UpcomingExpense {
  const days     = daysUntil(commitment.dueDate, today);
  const isIncome = commitment.type === 'ingreso';

  return {
    id: commitment.id,
    name: commitment.description,
    urgency: urgencyLabel(days, isIncome),
    // Un sueldo que llega mañana no es una alerta: solo lo que DEBES puede urgir.
    isUrgent: !isIncome && days <= URGENT_DAYS,
    isIncome,
    amount: commitment.amount,
    iconName: jar.iconName,
  };
}
