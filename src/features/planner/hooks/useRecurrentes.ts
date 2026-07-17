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

import { Debt } from '@core/entities/Debt';
import { Recurrence } from '@core/entities/Recurrence';
import { CancelDebt } from '@core/use-cases/CancelDebt';
import { CancelRecurrence } from '@core/use-cases/CancelRecurrence';
import { monthKey } from '@core/use-cases/ComputeMonthlyTotals';
import { debtRepository, recurrenceRepository } from '@infrastructure/container';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import { buildDebt, buildRecurrence, toDebtRecurringDisplay, toRecurringDisplay } from '../recurringMappers';
import type { JarPresentation } from '@shared/styles';
import type { CreateRecurringData, SaveRecurringData, RecurringActions, RecurringDisplay } from '../types';

const WORKSPACE_ID = 'ws1';

const cancelRecurrence = new CancelRecurrence(recurrenceRepository);
const cancelDebt = new CancelDebt(debtRepository);

type Setter<T> = (fn: (prev: T[]) => T[]) => void;

export function useRecurrentes(
  recurrences: Recurrence[],
  debts: Debt[],
  setRecurrences: Setter<Recurrence>,
  setDebts: Setter<Debt>,
  jarOf: (jarId: string) => JarPresentation,
) {
  // El libro decide si eliminar cancela o borra. Del store, misma fuente que la Agenda.
  const transactions = useTransactionsStore((s) => s.transactions);
  const thisMonth = monthKey(new Date());

  const recurrentes: RecurringDisplay[] = useMemo(() => [
    ...recurrences.map((r) => toRecurringDisplay(r, jarOf(r.jarId),
      transactions.filter((t) => t.recurrenceId === r.id).length, thisMonth)),
    ...debts.map((d) => toDebtRecurringDisplay(d, jarOf(d.sourceJarId),
      transactions.filter((t) => t.debtId === d.id).length, thisMonth)),
  ], [recurrences, debts, jarOf, transactions, thisMonth]);

  const onCreate = useCallback(async (d: CreateRecurringData) => {
    if (d.filter === 'deudas') {
      const debt = buildDebt(d, `debt-${Date.now()}`, new Date(), 'cuotas');
      await debtRepository.save(debt);
      setDebts((prev) => [...prev, debt]);
    } else {
      const rec = buildRecurrence(d, `rec-${Date.now()}`, monthKey(new Date()));
      await recurrenceRepository.save(rec);
      setRecurrences((prev) => [...prev, rec]);
    }
  }, [setRecurrences, setDebts]);

  const onSave = useCallback(async (d: SaveRecurringData) => {
    if (d.filter === 'deudas') {
      const prev = debts.find((x) => x.id === d.id);
      const debt = buildDebt(d, d.id, prev?.createdAt ?? new Date(), prev?.origin ?? 'cuotas');
      await debtRepository.update(debt);
      setDebts((list) => list.map((x) => (x.id === d.id ? debt : x)));
    } else {
      const prev = recurrences.find((x) => x.id === d.id);
      const rec = buildRecurrence(d, d.id, prev?.startMonth ?? monthKey(new Date()));
      await recurrenceRepository.update(rec);
      setRecurrences((list) => list.map((x) => (x.id === d.id ? rec : x)));
    }
  }, [debts, recurrences, setRecurrences, setDebts]);

  /**
   * Eliminar un compromiso. **La app decide, el usuario no elige**: le pregunta al libro si tiene
   * pagos. Con pagos → CANCELA (hay historia que cuidar; borrar la fila la haría desaparecer de
   * TODOS los meses, incluidos los pagados). Sin pagos → borra de verdad: no significó nada, y
   * dejarlo cancelado llenaría el historial de ruido. El libro no se toca en ninguno de los dos.
   */
  const onDelete = useCallback(async (id: string) => {
    const isRecurrence = recurrences.some((r) => r.id === id);
    const hasPayments = transactions.some((t) => (isRecurrence ? t.recurrenceId : t.debtId) === id);

    if (isRecurrence) {
      if (hasPayments) {
        const { recurrence } = await cancelRecurrence.execute({ recurrenceId: id, today: new Date() });
        setRecurrences((list) => list.map((r) => (r.id === id ? recurrence : r)));
      } else {
        await recurrenceRepository.delete(id);
        setRecurrences((list) => list.filter((r) => r.id !== id));
      }
      return;
    }

    if (hasPayments) {
      const { debt } = await cancelDebt.execute({ debtId: id, today: new Date() });
      setDebts((list) => list.map((d) => (d.id === id ? debt : d)));
    } else {
      await debtRepository.delete(id);
      setDebts((list) => list.filter((x) => x.id !== id));
    }
  }, [recurrences, transactions, setRecurrences, setDebts]);

  const recurrenteActions: RecurringActions = useMemo(() => ({ onCreate, onSave, onDelete }), [onCreate, onSave, onDelete]);
  return { recurrentes, recurrenteActions };
}
