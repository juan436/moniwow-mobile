/**
 * useRecurrentes — Hook
 *
 * @what     CRUD del tab Recurrentes sobre los repos REALES: el wizard "Programar compromiso" crea
 *           tres cosas y aquí se enrutan — `ingreso`/`gasto` → `Recurrence`, `deuda` → `Debt`.
 * @receives recurrences, debts (las MISMAS que alimentan la Agenda) + sus setters + jarOf.
 * @processes La lista display se deriva de esas dos entidades — una sola fuente, ya no un mock
 *           (`INITIAL_RECURRENTES`) paralelo. El ícono sale de la jarra (no de un mapa hardcodeado).
 *           Editar/borrar enrutan por `filter` (o por membresía en delete, que no lo trae). Al editar
 *           se preserva lo que el form no toca: `createdAt` de la deuda y `startMonth` de la regla.
 *           **Eliminar le pregunta al LIBRO**: con pagos cancela, sin pagos borra — ver `onDelete`.
 *           Las funciones puras (construir entidades, mapear a display) viven en `recurringMappers`:
 *           salieron cuando este archivo pasó de 150 líneas.
 * @returns  { recurrentes, recurrenteActions }
 */
import { useCallback, useMemo } from 'react';

import { monthKey } from '@core/utils/monthKey';
import { debtActions, recurrenceActions } from '@infrastructure/container';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import {
  toDebtRecurringDisplay,
  toDebtWriteInput,
  toRecurrenceWriteInput,
  toRecurringDisplay,
} from '../recurringMappers';
import type { DebtWithStatus } from '@core/types/DebtStatus';
import type { RecurrenceWithStatus } from '@core/types/RecurrenceStatus';
import type { JarPresentation } from '@shared/styles';
import type { CreateRecurringData, SaveRecurringData, RecurringActions, RecurringDisplay } from '../types';

type Setter<T> = (fn: (prev: T[]) => T[]) => void;

export function useRecurrentes(
  recurrences: RecurrenceWithStatus[],
  debts: DebtWithStatus[],
  setRecurrences: Setter<RecurrenceWithStatus>,
  setDebts: Setter<DebtWithStatus>,
  jarOf: (jarId: string) => JarPresentation,
) {
  // El libro decide si eliminar cancela o borra. Del store, misma fuente que la Agenda.
  const transactions = useTransactionsStore((s) => s.transactions);
  const thisMonth = monthKey(new Date());

  const recurrentes: RecurringDisplay[] = useMemo(() => [
    ...recurrences.map(({ recurrence: r }) => toRecurringDisplay(r, jarOf(r.jarId),
      transactions.filter((t) => t.recurrenceId === r.id).length, thisMonth)),
    ...debts.map(({ debt: d }) => toDebtRecurringDisplay(d, jarOf(d.sourceJarId),
      transactions.filter((t) => t.debtId === d.id).length, thisMonth)),
  ], [recurrences, debts, jarOf, transactions, thisMonth]);

  // El id, el total y el calendario (deuda) / `startMonth`+`endMonth` (regla) los arma el SERVIDOR
  // desde el form; se muestra la entidad que devuelve, ya con su estado del libro.
  const onCreate = useCallback(async (d: CreateRecurringData) => {
    if (d.filter === 'deudas') {
      const created = await debtActions.create(toDebtWriteInput(d));
      setDebts((prev) => [...prev, created]);
    } else {
      const created = await recurrenceActions.create(toRecurrenceWriteInput(d));
      setRecurrences((prev) => [...prev, created]);
    }
  }, [setRecurrences, setDebts]);

  // Editar preserva `createdAt`/`startMonth`/`cancelledAt` del lado servidor: ya no hace falta buscar
  // la entidad previa. Se reemplaza la fila con la que devuelve la API.
  const onSave = useCallback(async (d: SaveRecurringData) => {
    if (d.filter === 'deudas') {
      const updated = await debtActions.update(d.id, toDebtWriteInput(d));
      setDebts((list) => list.map((x) => (x.debt.id === d.id ? updated : x)));
    } else {
      const updated = await recurrenceActions.update(d.id, toRecurrenceWriteInput(d));
      setRecurrences((list) => list.map((x) => (x.recurrence.id === d.id ? updated : x)));
    }
  }, [setRecurrences, setDebts]);

  /**
   * Eliminar un compromiso. **La app decide, el usuario no elige**: le pregunta al libro si tiene
   * pagos. Con pagos → CANCELA (hay historia que cuidar; borrar la fila la haría desaparecer de
   * TODOS los meses, incluidos los pagados). Sin pagos → borra de verdad: no significó nada, y
   * dejarlo cancelado llenaría el historial de ruido. El libro no se toca en ninguno de los dos.
   */
  const onDelete = useCallback(async (id: string) => {
    const isRecurrence = recurrences.some((r) => r.recurrence.id === id);
    const hasPayments = transactions.some((t) => (isRecurrence ? t.recurrenceId : t.debtId) === id);

    if (isRecurrence) {
      if (hasPayments) {
        // Cancela en el servidor y reemplaza la fila con el estado ya recalculado que devuelve.
        const updated = await recurrenceActions.cancel(id);
        setRecurrences((list) => list.map((r) => (r.recurrence.id === id ? updated : r)));
      } else {
        await recurrenceActions.remove(id);
        setRecurrences((list) => list.filter((r) => r.recurrence.id !== id));
      }
      return;
    }

    if (hasPayments) {
      const updated = await debtActions.cancel(id);
      setDebts((list) => list.map((d) => (d.debt.id === id ? updated : d)));
    } else {
      await debtActions.remove(id);
      setDebts((list) => list.filter((x) => x.debt.id !== id));
    }
  }, [recurrences, transactions, setRecurrences, setDebts]);

  const recurrenteActions: RecurringActions = useMemo(() => ({ onCreate, onSave, onDelete }), [onCreate, onSave, onDelete]);
  return { recurrentes, recurrenteActions };
}
