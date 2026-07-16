/**
 * useRecurrentes — Hook
 *
 * @what     CRUD del tab Recurrentes sobre los repos REALES: el wizard "Programar compromiso" crea
 *           tres cosas y aquí se enrutan — `ingreso`/`gasto` → `Recurrence`, `deuda` → `Debt`.
 * @receives recurrences, debts (las MISMAS que alimentan la Agenda) + sus setters + jarOf.
 * @processes La lista display se deriva de esas dos entidades — una sola fuente, ya no un mock
 *           (`INITIAL_RECURRENTES`) paralelo. El ícono sale de la jarra (no de un mapa hardcodeado).
 *           `monto` es MENSUAL: para una deuda es la cuota, el total = amount × cuotas. Editar/borrar
 *           enrutan por `filter` (o por membresía en delete, que no lo trae). Al editar se preserva
 *           lo que el form no toca: `createdAt` de la deuda (su calendario) y `startMonth` de la regla.
 * @returns  { recurrentes, recurrenteActions }
 */
import { useCallback, useMemo } from 'react';

import { Debt } from '@core/entities/Debt';
import { Recurrence } from '@core/entities/Recurrence';
import { monthKey } from '@core/use-cases/ComputeMonthlyTotals';
import { debtRepository, recurrenceRepository } from '@infrastructure/container';
import { asRecurringJar } from '../jarOptions';
import type { JarPresentation } from '@shared/styles';
import type { CreateRecurringData, SaveRecurringData, RecurringActions, RecurringDisplay } from '../types';

const WORKSPACE_ID = 'ws1';

type Setter<T> = (fn: (prev: T[]) => T[]) => void;

export function useRecurrentes(
  recurrences: Recurrence[],
  debts: Debt[],
  setRecurrences: Setter<Recurrence>,
  setDebts: Setter<Debt>,
  jarOf: (jarId: string) => JarPresentation,
) {
  const recurrentes: RecurringDisplay[] = useMemo(() => [
    ...recurrences.map((r) => toRecurringDisplay(r, jarOf(r.jarId))),
    ...debts.map((d) => toDebtRecurringDisplay(d, jarOf(d.sourceJarId))),
  ], [recurrences, debts, jarOf]);

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

  const onDelete = useCallback(async (id: string) => {
    if (recurrences.some((r) => r.id === id)) {
      await recurrenceRepository.delete(id);
      setRecurrences((list) => list.filter((r) => r.id !== id));
    } else {
      await debtRepository.delete(id);
      setDebts((list) => list.filter((x) => x.id !== id));
    }
  }, [recurrences, setRecurrences, setDebts]);

  const recurrenteActions: RecurringActions = useMemo(() => ({ onCreate, onSave, onDelete }), [onCreate, onSave, onDelete]);
  return { recurrentes, recurrenteActions };
}

/** 'YYYY-MM' + n meses. */
function addMonths(month: string, n: number): string {
  const [year, m] = month.split('-').map(Number);
  return monthKey(new Date(year, m - 1 + n, 1));
}
/** Cuántos meses cubre [start, end] inclusive. */
function monthsInclusive(start: string, end: string): number {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}

function buildRecurrence(d: CreateRecurringData, id: string, startMonth: string): Recurrence {
  return new Recurrence({
    id, name: d.name, amount: d.amount,
    type: d.filter === 'ingresos' ? 'ingreso' : 'gasto',
    dayOfMonth: Math.min(d.day, 28), jarId: d.jarra, startMonth,
    endMonth: d.frecuencia === 'cuotas' ? addMonths(startMonth, d.cuotas - 1) : undefined,
    workspaceId: WORKSPACE_ID,
  });
}
function buildDebt(d: CreateRecurringData, id: string, createdAt: Date, origin: Debt['origin']): Debt {
  return new Debt({
    id, description: d.name, amount: d.amount * d.cuotas, cuotas: d.cuotas,
    dueDay: Math.min(d.day, 28), sourceJarId: d.jarra, workspaceId: WORKSPACE_ID, createdAt, origin,
  });
}

function toRecurringDisplay(rec: Recurrence, jar: JarPresentation): RecurringDisplay {
  return {
    id: rec.id, iconName: jar.iconName, iconColor: jar.iconColor, iconBg: jar.iconBg,
    name: rec.name, day: rec.dayOfMonth, amount: rec.amount,
    filter: rec.type === 'ingreso' ? 'ingresos' : 'gastos',
    jarra: asRecurringJar(rec.jarId),
    frecuencia: rec.endMonth ? 'cuotas' : 'indefinido',
    cuotas: rec.endMonth ? monthsInclusive(rec.startMonth, rec.endMonth) : 12,
  };
}
function toDebtRecurringDisplay(debt: Debt, jar: JarPresentation): RecurringDisplay {
  return {
    id: debt.id, iconName: jar.iconName, iconColor: jar.iconColor, iconBg: jar.iconBg,
    name: debt.description, day: debt.dueDay, amount: debt.cuotaAmount(),
    filter: 'deudas', jarra: asRecurringJar(debt.sourceJarId), frecuencia: 'cuotas', cuotas: debt.cuotas,
  };
}
