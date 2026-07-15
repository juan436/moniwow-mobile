/**
 * useGoals — Hook
 *
 * @what     Estado de la feature Metas (M10): lista de metas + modales crear/editar/aportar/sacrificar.
 * @receives —
 * @processes Guarda entidades `Goal` (hidratadas de goalRepository) y las mapea a `GoalItem` para
 *           pintar — igual que Jarras: el estado es el dominio, el display se DERIVA. CRUD persiste
 *           al repo (create/save/delete/deposit), no solo a memoria: antes se perdía al recargar.
 *           Modelo "pozo financiado, luego repartido": `poolTotal` = balance de la jarra Metas,
 *           DERIVADO del libro en vivo (C4); `asignado` = Σ `currentAmount` (dato guardado);
 *           `disponible = poolTotal − asignado` es lo SIN asignar. handleDeposit (Aportar) reasigna
 *           dentro del pozo — el dinero ya está en la jarra Metas, no toca el libro, pero sí cambia
 *           `currentAmount` → se persiste. handleWithdraw (Sacrificio) SÍ mueve dinero (Metas → Libre):
 *           `WithdrawFromGoal` escribe la transferencia y persiste la meta; usamos la que devuelve.
 * @returns  { goals, isAddVisible, selectedGoal, poolTotal, asignado, disponible, handleAnadir,
 *            handleCloseAdd, handleCreate, handleCardPress, handleCloseEdit, handleSave,
 *            handleDelete, handleWithdraw, handleDeposit }
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Goal } from '@core/entities/Goal';
import { ComputeJarBalances } from '@core/use-cases/ComputeJarBalances';
import { WithdrawFromGoal } from '@core/use-cases/WithdrawFromGoal';
import { goalRepository, jarRepository, transactionRepository } from '@infrastructure/container';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import { toGoalItem } from '../mappers';
import type { GoalItem, CreateGoalData, SaveGoalData } from '../types';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado
const USER_ID = 'u1';
const GOALS_JAR_ID = 'goals';

const computeBalances = new ComputeJarBalances();
const withdrawFromGoal = new WithdrawFromGoal(goalRepository, jarRepository, transactionRepository);

/** Reconstruye la meta preservando lo que el form no toca (saldo asignado, fecha objetivo). */
function editGoal(base: Goal, data: SaveGoalData): Goal {
  return new Goal({
    id: base.id, name: data.name, icon: data.icon, targetAmount: data.targetAmount,
    currentAmount: base.currentAmount, workspaceId: base.workspaceId, targetDate: base.targetDate,
  });
}
/** Reasigna el saldo del pozo (Aportar): cambia solo `currentAmount`, no el libro. */
function reassign(goal: Goal, currentAmount: number): Goal {
  return new Goal({
    id: goal.id, name: goal.name, icon: goal.icon, targetAmount: goal.targetAmount,
    currentAmount, workspaceId: goal.workspaceId, targetDate: goal.targetDate,
  });
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);

  const transactions = useTransactionsStore((s) => s.transactions);
  const loadLedger   = useTransactionsStore((s) => s.load);
  const addToLedger  = useTransactionsStore((s) => s.add);

  useEffect(() => {
    let active = true;
    void loadLedger();
    void goalRepository.findByWorkspace(WORKSPACE_ID).then((gs) => {
      if (active) setGoals(gs);
    });
    return () => {
      active = false;
    };
  }, [loadLedger]);

  const goalItems = useMemo(() => goals.map(toGoalItem), [goals]);
  // El pozo es el balance de la jarra Metas — derivado del libro, no un campo guardado (C4).
  const poolTotal  = useMemo(
    () => computeBalances.execute(transactions).get(GOALS_JAR_ID) ?? 0,
    [transactions],
  );
  const asignado   = useMemo(() => goals.reduce((sum, g) => sum + g.currentAmount, 0), [goals]);
  const disponible = poolTotal - asignado;

  const handleAnadir    = useCallback(() => setIsAddVisible(true), []);
  const handleCloseAdd  = useCallback(() => setIsAddVisible(false), []);
  const handleCardPress = useCallback((goal: GoalItem) => setSelectedGoal(goal), []);
  const handleCloseEdit = useCallback(() => setSelectedGoal(null), []);

  const handleCreate = useCallback((data: CreateGoalData) => {
    const goal = new Goal({
      id: `goal-${Date.now()}`, name: data.name, icon: data.icon,
      targetAmount: data.targetAmount, currentAmount: 0, workspaceId: WORKSPACE_ID,
    });
    void goalRepository.save(goal);
    setGoals((g) => [...g, goal]);
  }, []);

  const handleSave = useCallback((data: SaveGoalData) => {
    setGoals((g) => {
      const base = g.find((x) => x.id === data.id);
      if (!base) return g;
      const updated = editGoal(base, data);
      void goalRepository.update(updated);
      return g.map((x) => (x.id === updated.id ? updated : x));
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    void goalRepository.delete(id);
    setGoals((g) => g.filter((x) => x.id !== id));
  }, []);

  // Sacar de una meta mueve dinero de verdad (Metas → Libre): tiene que quedar en el libro, o el
  // pozo —que ahora se deriva— no bajaría. El use-case persiste la meta; reflejamos la que devuelve.
  const handleWithdraw = useCallback(async (id: string, amount: number) => {
    const { goal, transaction } = await withdrawFromGoal.execute({
      id: `tx-${Date.now()}`,
      goalId: id,
      amount,
      workspaceId: WORKSPACE_ID,
      userId: USER_ID,
    });
    await addToLedger(transaction);
    setGoals((g) => g.map((x) => (x.id === id ? goal : x)));
  }, [addToLedger]);

  const handleDeposit = useCallback((id: string, amount: number) => {
    setGoals((g) => {
      const base = g.find((x) => x.id === id);
      if (!base) return g;
      const updated = reassign(base, base.currentAmount + amount);
      void goalRepository.update(updated);
      return g.map((x) => (x.id === id ? updated : x));
    });
  }, []);

  return {
    goals: goalItems, isAddVisible, selectedGoal, poolTotal, asignado, disponible,
    handleAnadir, handleCloseAdd, handleCreate,
    handleCardPress, handleCloseEdit, handleSave, handleDelete,
    handleWithdraw, handleDeposit,
  };
}
