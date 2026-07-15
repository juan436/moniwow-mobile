/**
 * usePlanner — Hook
 *
 * @what     Estado y datos de la Agenda + CRUD local de compromisos recurrentes.
 * @receives —
 * @processes **Ya no hay `MOCK_DATA`.** Los compromisos salen de `agendaRepository` (`pendingItems`)
 *           y las deudas de `debtRepository` — la Agenda no inventa nada. Los totales se DERIVAN de
 *           esas listas (antes eran tres literales escritos a mano que nadie recalculaba).
 *           **Confirmar ESCRIBE en el libro**: Pagar/¡Llegó! → `ConfirmPendingItem`; pagar una cuota
 *           → `PayDebtCuota`. Antes los tres botones solo daban la vuelta a un booleano en memoria:
 *           marcabas la renta como pagada y el balance de Hogar ni se enteraba.
 *           **La unidad de deuda es la CUOTA, no la deuda.** `ComputeDebtStatus` cruza el calendario
 *           de la deuda con el libro: la cuota de este mes **y las atrasadas de meses anteriores**
 *           (que se acumulan). Un `paidCuotas` guardado decía "llevas 7" sin decir cuáles, así que
 *           no sabía que te saltaste mayo. `inFlight` bloquea el doble toque mientras se guarda.
 * @returns  { activeTab, setActiveTab, activeFilter, setActiveFilter, data, onConfirmItem, overdue,
 *            recurrentes, recurrenteActions, isLoading, error }
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ConfirmPendingItem } from '@core/use-cases/ConfirmPendingItem';
import { PayDebtCuota } from '@core/use-cases/PayDebtCuota';
import { agendaRepository, debtRepository, jarRepository, transactionRepository } from '@infrastructure/container';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import { toJarPresentation, colorByType, type JarPresentation } from '@shared/styles';
import { buildAgenda } from '../agenda';
import { INITIAL_RECURRENTES, RECURRENTE_ICON } from '../recurringMocks';
import type { Debt } from '@core/entities/Debt';
import type { PendingItem } from '@core/ports/IAgendaRepository';
import type {
  AgendaTab, AgendaFilter, RecurringDisplay,
  CreateRecurringData, SaveRecurringData, RecurringActions,
} from '../types';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado
const USER_ID = 'u1';
const FALLBACK: JarPresentation = { name: 'Libre', iconName: 'account-balance-wallet', ...colorByType('libre') };

const confirmPendingItem = new ConfirmPendingItem(jarRepository, transactionRepository, agendaRepository);
const payDebtCuota = new PayDebtCuota(debtRepository, jarRepository, transactionRepository);

export function usePlanner() {
  const [activeTab, setActiveTab] = useState<AgendaTab>('mi-mes');
  const [activeFilter, setActiveFilter] = useState<AgendaFilter>('gastos');
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [presById, setPresById] = useState<Map<string, JarPresentation>>(new Map());
  const [recurrentes, setRecurrentes] = useState<RecurringDisplay[]>(INITIAL_RECURRENTES);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const inFlight = useRef(new Set<string>()); // toques repetidos mientras el guardado va en vuelo

  const transactions = useTransactionsStore((s) => s.transactions);
  const loadLedger = useTransactionsStore((s) => s.load);
  const addToLedger = useTransactionsStore((s) => s.add);

  useEffect(() => { void loadLedger(); }, [loadLedger]);

  const load = useCallback(async () => {
    try {
      const [items, ds, jars] = await Promise.all([
        agendaRepository.findByWorkspace(WORKSPACE_ID),
        debtRepository.findByWorkspace(WORKSPACE_ID),
        jarRepository.findByWorkspace(WORKSPACE_ID),
      ]);
      setPending(items);
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

  const { data, overdue, toConfirm } = useMemo(
    () => buildAgenda(pending, debts, transactions, (id) => presById.get(id) ?? FALLBACK, new Date()),
    [pending, debts, presById, transactions],
  );

  /** Pagar / ¡Llegó! / pagar cuota (la del mes o una atrasada). Los tres escriben en el libro. */
  const onConfirmItem = useCallback(async (id: string) => {
    const item = [...data.items, ...overdue, ...toConfirm].find((i) => i.id === id);
    if (!item || item.isPaid || inFlight.current.has(id)) return;

    inFlight.current.add(id);
    try {
      setError(null);
      const txId = `tx-${Date.now()}`;

      const { transaction } = item.debtId && item.cuotaMonth
        ? await payDebtCuota.execute({
            id: txId,
            debtId: item.debtId,
            cuotaMonth: item.cuotaMonth, // QUÉ cuota se salda; la jarra la pone la deuda
            workspaceId: WORKSPACE_ID,
            userId: USER_ID,
          })
        : await confirmPendingItem.execute({
            id: txId,
            pendingItemId: id,
            workspaceId: WORKSPACE_ID,
            userId: USER_ID,
          });

      await addToLedger(transaction);
      await load(); // relee compromisos: su estado vive en la BD, no en memoria
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo confirmar el compromiso — intenta de nuevo');
    } finally {
      inFlight.current.delete(id);
    }
  }, [data.items, overdue, toConfirm, addToLedger, load]);

  const handleCreateRecurrente = useCallback((d: CreateRecurringData) => {
    setRecurrentes((prev) => [...prev, { id: `r_${Date.now()}`, ...RECURRENTE_ICON[d.filter], ...d }]);
  }, []);
  const handleSaveRecurrente = useCallback((d: SaveRecurringData) => {
    setRecurrentes((prev) => prev.map((r) => r.id === d.id ? { ...r, ...RECURRENTE_ICON[d.filter], ...d } : r));
  }, []);
  const handleDeleteRecurrente = useCallback((id: string) => {
    setRecurrentes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const recurrenteActions: RecurringActions = useMemo(() => ({
    onCreate: handleCreateRecurrente,
    onSave: handleSaveRecurrente,
    onDelete: handleDeleteRecurrente,
  }), [handleCreateRecurrente, handleSaveRecurrente, handleDeleteRecurrente]);

  return {
    activeTab, setActiveTab, activeFilter, setActiveFilter,
    data, overdue, toConfirm, onConfirmItem, recurrentes, recurrenteActions,
    isLoading, error,
  };
}
