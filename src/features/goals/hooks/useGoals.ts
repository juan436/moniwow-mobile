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
 *           **`onJarsChanged` (FB-015):** withdraw cambia el balance de Metas Y Libre — quien
 *           mantiene esas jarras es `jarsStore` (Zustand), ajeno a esta hook (`goals/` no importa
 *           `jars/`, mismo principio que `QuickAddTab`). Se compone en la ruta y baja como callback,
 *           igual que el `reload` de FB-013.
 * @returns  { goals, isAddVisible, selectedGoal, poolTotal, asignado, disponible, handleAnadir,
 *            handleCloseAdd, handleCreate, handleCardPress, handleCloseEdit, handleSave,
 *            handleDelete, handleWithdraw, handleDeposit }
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Goal } from '@core/entities/Goal';
import { goalRepository, jarRepository, goalActions } from '@infrastructure/container';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import { toGoalItem } from '../mappers';
import type { GoalItem, CreateGoalData, SaveGoalData } from '../types';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado

export function useGoals(onJarsChanged?: () => void) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [poolTotal, setPoolTotal] = useState(0);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);

  const transactions = useTransactionsStore((s) => s.transactions);
  const loadLedger   = useTransactionsStore((s) => s.load);
  const addToLedger  = useTransactionsStore((s) => s.add);

  // El pozo es el balance de la jarra Metas. Sigue sin almacenarse (C4) — solo que ahora lo suma el
  // servidor. **La jarra se busca por `type`, no por el id `'goals'`**: ese id solo existe en el
  // workspace sembrado; con un usuario nuevo el pozo habría dado 0 sin ningún error visible.
  const loadPool = useCallback(async () => {
    const jars = await jarRepository.findByWorkspace(WORKSPACE_ID);
    setPoolTotal(jars.find((j) => j.type === 'goals')?.balance ?? 0);
  }, []);

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

  // Relee el pozo cuando crece el libro: sacar de una meta mueve dinero de verdad.
  useEffect(() => { void loadPool(); }, [loadPool, transactions.length]);

  const goalItems = useMemo(() => goals.map(toGoalItem), [goals]);
  const asignado   = useMemo(() => goals.reduce((sum, g) => sum + g.currentAmount, 0), [goals]);
  const disponible = poolTotal - asignado;

  const handleAnadir    = useCallback(() => setIsAddVisible(true), []);
  const handleCloseAdd  = useCallback(() => setIsAddVisible(false), []);
  const handleCardPress = useCallback((goal: GoalItem) => setSelectedGoal(goal), []);
  const handleCloseEdit = useCallback(() => setSelectedGoal(null), []);

  // El id y el `currentAmount` inicial (0) los pone el SERVIDOR (`POST /goals`); se muestra la meta que
  // devuelve, ya con su id real. Antes se armaba con `goal-${Date.now()}` y se escribía a ciegas.
  const handleCreate = useCallback((data: CreateGoalData) => {
    void goalActions
      .create({ name: data.name, icon: data.icon, targetAmount: data.targetAmount })
      .then((goal) => setGoals((g) => [...g, goal]));
  }, []);

  // Editar solo cambia nombre/icono/objetivo; el saldo asignado y la fecha los preserva el servidor.
  const handleSave = useCallback((data: SaveGoalData) => {
    void goalActions
      .update(data.id, { name: data.name, icon: data.icon, targetAmount: data.targetAmount })
      .then((goal) => setGoals((g) => g.map((x) => (x.id === goal.id ? goal : x))));
  }, []);

  const handleDelete = useCallback((id: string) => {
    void goalActions.remove(id).then(() => setGoals((g) => g.filter((x) => x.id !== id)));
  }, []);

  // Sacar de una meta mueve dinero de verdad (Metas → Libre): tiene que quedar en el libro, o el
  // pozo —que ahora se deriva— no bajaría. El use-case persiste la meta; reflejamos la que devuelve.
  const handleWithdraw = useCallback(async (id: string, amount: number) => {
    // El servidor baja el `currentAmount` de la meta y escribe la transferencia Metas → Libre; devuelve
    // ambos. Reflejamos la meta que devuelve (no restamos a mano) y metemos el movimiento al libro.
    const { goal, transaction } = await goalActions.withdraw(id, amount);
    await addToLedger(transaction);
    setGoals((g) => g.map((x) => (x.id === id ? goal : x)));
    onJarsChanged?.();
  }, [addToLedger, onJarsChanged]);

  // Aportar reasigna dentro del pozo (sube `currentAmount`, no toca el libro). Lo hace el servidor y
  // devuelve la meta con el nuevo saldo asignado.
  const handleDeposit = useCallback((id: string, amount: number) => {
    void goalActions.deposit(id, amount).then((goal) =>
      setGoals((g) => g.map((x) => (x.id === id ? goal : x))));
  }, []);

  return {
    goals: goalItems, isAddVisible, selectedGoal, poolTotal, asignado, disponible,
    handleAnadir, handleCloseAdd, handleCreate,
    handleCardPress, handleCloseEdit, handleSave, handleDelete,
    handleWithdraw, handleDeposit,
  };
}
