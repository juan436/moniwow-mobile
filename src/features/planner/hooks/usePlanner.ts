/**
 * usePlanner — Hook
 *
 * @what     Estado y datos de la Agenda + CRUD local de compromisos recurrentes.
 * @receives —
 * @processes La Agenda se DERIVA: reglas recurrentes (`recurrenceRepository`) + deudas
 *           (`debtRepository`), **que ya llegan cruzadas con el libro por el servidor**. Cada
 *           ocurrencia del mes y las atrasadas vienen en su `status`; mobile ya no las calcula
 *           (`ComputeRecurringOccurrences` / `ComputeDebtStatus` se fueron). **Ya no hay `pendingItems`**.
 *           **Confirmar ESCRIBE en el libro, y lo hace la API**: recurrente → `recurrenceActions`;
 *           cuota → `debtActions` (ambos con `recurrenceMonth`/`cuotaMonth`: QUÉ ocurrencia se cubre,
 *           no cuándo). Antes un booleano en memoria: marcabas la renta pagada y el balance de Hogar
 *           ni se enteraba.
 *           El CRUD del tab Recurrentes vive en `useRecurrentes` (enruta a Recurrence / Debt).
 *           `inFlight` bloquea el doble toque mientras se guarda.
 * @returns  { activeTab, setActiveTab, activeFilter, setActiveFilter, data, onConfirmItem, overdue,
 *            recurrentes, recurrenteActions, isLoading, error }
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { recurrenceRepository, debtRepository, jarRepository, debtActions, recurrenceActions } from '@infrastructure/container';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import { toJarPresentation, colorByType, type JarPresentation } from '@shared/styles';
import { buildAgenda } from '../agenda';
import { useRecurrentes } from './useRecurrentes';
import type { Transaction } from '@core/entities/Transaction';
import type { DebtWithStatus } from '@core/types/DebtStatus';
import type { RecurrenceWithStatus } from '@core/types/RecurrenceStatus';
import type { AgendaTab, AgendaFilter } from '../types';

// Solo para LEER: los repos aún piden el workspace por firma aunque el servidor lo saque del token.
// Escribir ya no lo necesita — las acciones no lo mandan.
const WORKSPACE_ID = 'ws1';
const FALLBACK: JarPresentation = { name: 'Libre', iconName: 'account-balance-wallet', ...colorByType('libre') };

export function usePlanner() {
  const [activeTab, setActiveTab] = useState<AgendaTab>('mi-mes');
  const [activeFilter, setActiveFilter] = useState<AgendaFilter>('gastos');
  const [recurrences, setRecurrences] = useState<RecurrenceWithStatus[]>([]);
  const [debts, setDebts] = useState<DebtWithStatus[]>([]);
  const [presById, setPresById] = useState<Map<string, JarPresentation>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const inFlight = useRef(new Set<string>()); // toques repetidos mientras el guardado va en vuelo

  const transactions = useTransactionsStore((s) => s.transactions);
  const loadLedger = useTransactionsStore((s) => s.load);
  const addToLedger = useTransactionsStore((s) => s.add);

  useEffect(() => { void loadLedger(); }, [loadLedger]);

  const load = useCallback(async () => {
    try {
      const [recs, ds, jars] = await Promise.all([
        recurrenceRepository.findByWorkspace(WORKSPACE_ID),
        debtRepository.findByWorkspace(WORKSPACE_ID),
        jarRepository.findByWorkspace(WORKSPACE_ID),
      ]);
      setRecurrences(recs);
      setDebts(ds);
      setPresById(new Map(jars.map((j) => [j.id, toJarPresentation(j)])));
    } catch {
      setError('No se pudo cargar la agenda');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Relee al crecer el libro. Sin esto, pagar un atrasado desde su página (otra instancia de este
  // hook) no refrescaba la Agenda: su `pending`/`debts` se cargaban una vez y quedaban viejos, así
  // que el banner seguía contando algo ya pagado. Confirmar cualquier compromiso añade una tx.
  useEffect(() => { void load(); }, [load, transactions.length]);

  const jarOf = useCallback((id: string) => presById.get(id) ?? FALLBACK, [presById]);

  const { data, overdue, toConfirm } = useMemo(
    () => buildAgenda(recurrences, debts, jarOf, new Date()),
    [recurrences, debts, jarOf],
  );

  const { recurrentes, recurrenteActions } = useRecurrentes(recurrences, debts, setRecurrences, setDebts, jarOf);

  /** Pagar / ¡Llegó! / pagar cuota (la del mes o una atrasada). Los tres escriben en el libro. */
  const onConfirmItem = useCallback(async (id: string) => {
    const item = [...data.items, ...overdue, ...toConfirm].find((i) => i.id === id);
    if (!item || item.isPaid || inFlight.current.has(id)) return;

    inFlight.current.add(id);
    try {
      setError(null);

      // El id del movimiento, el monto y la jarra los pone el SERVIDOR: solo se dice qué cuota u
      // ocurrencia se cubre. Ver la decisión B en los ports de acción.
      let transaction: Transaction;
      if (item.debtId && item.cuotaMonth) {
        // QUÉ cuota se salda; la jarra la pone la deuda.
        transaction = await debtActions.payCuota(item.debtId, item.cuotaMonth);
      } else if (item.recurrenceId && item.recurrenceMonth) {
        // QUÉ ocurrencia se cubre; la jarra y el signo los pone la regla.
        transaction = await recurrenceActions.confirm(item.recurrenceId, item.recurrenceMonth);
      } else {
        return; // sin enlace no hay qué confirmar
      }

      await addToLedger(transaction);
      await load(); // relee compromisos: su estado vive en la BD, no en memoria
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo confirmar el compromiso — intenta de nuevo');
    } finally {
      inFlight.current.delete(id);
    }
  }, [data.items, overdue, toConfirm, addToLedger, load]);

  return {
    activeTab, setActiveTab, activeFilter, setActiveFilter,
    data, overdue, toConfirm, onConfirmItem, recurrentes, recurrenteActions,
    isLoading, error,
  };
}
