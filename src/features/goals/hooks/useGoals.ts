/**
 * useGoals — Hook
 *
 * @what     Estado de la feature Metas (M10): lista de metas + modales crear/editar/aportar/sacrificar.
 * @receives —
 * @processes Carga desde la BD (goalRepository → metas; jarRepository → balance de la jarra `goals`).
 *           Modelo "pozo financiado, luego repartido": `poolTotal` = balance de la jarra Metas (dato
 *           guardado, toda la plata dentro); `asignado` = Σ `current` de las metas (dato guardado);
 *           `disponible = poolTotal − asignado` es lo SIN asignar (DERIVADO). handleDeposit (Aportar)
 *           mueve de disponible → una meta (pool no cambia, se reasigna). handleWithdraw (Slider de
 *           Sacrificio) saca de una meta Y del pool (sale de Metas hacia Libre de verdad). CRUD en
 *           estado local sobre lo sembrado (mock-stage, mismo límite que jars/ hasta wirear mutaciones).
 * @returns  { goals, isAddVisible, selectedGoal, poolTotal, asignado, disponible, handleAnadir,
 *            handleCloseAdd, handleCreate, handleCardPress, handleCloseEdit, handleSave,
 *            handleDelete, handleWithdraw, handleDeposit }
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { goalRepository, jarRepository } from '@infrastructure/container';
import { toGoalItem } from '../mappers';
import type { GoalItem, CreateGoalData, SaveGoalData } from '../types';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado
const GOALS_JAR_ID = 'goals';

function recalc(goal: GoalItem, current: number): GoalItem {
  return { ...goal, current, progress: Math.min(100, Math.round((current / goal.target) * 100)) };
}

export function useGoals() {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [poolTotal, setPoolTotal] = useState(0);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const [gs, jars] = await Promise.all([
        goalRepository.findByWorkspace(WORKSPACE_ID),
        jarRepository.findByWorkspace(WORKSPACE_ID),
      ]);
      if (!active) return;
      setGoals(gs.map(toGoalItem));
      setPoolTotal(jars.find((j) => j.id === GOALS_JAR_ID)?.balance ?? 0);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const asignado   = useMemo(() => goals.reduce((sum, g) => sum + g.current, 0), [goals]);
  const disponible = poolTotal - asignado;

  const handleAnadir    = useCallback(() => setIsAddVisible(true), []);
  const handleCloseAdd  = useCallback(() => setIsAddVisible(false), []);
  const handleCreate    = useCallback((_data: CreateGoalData) => { /* TODO: CreateGoal use-case */ }, []);
  const handleCardPress = useCallback((goal: GoalItem) => setSelectedGoal(goal), []);
  const handleCloseEdit = useCallback(() => setSelectedGoal(null), []);
  const handleSave      = useCallback((data: SaveGoalData) => {
    setGoals((g) => g.map((x) => x.id === data.id ? { ...x, name: data.name, emoji: data.icon, target: data.targetAmount } : x));
  }, []);
  const handleDelete    = useCallback((id: string) => setGoals((g) => g.filter((x) => x.id !== id)), []);

  const handleWithdraw = useCallback((id: string, amount: number) => {
    setGoals((g) => g.map((x) => x.id === id ? recalc(x, Math.max(0, x.current - amount)) : x));
    setPoolTotal((p) => Math.max(0, p - amount));
  }, []);
  const handleDeposit = useCallback((id: string, amount: number) => {
    setGoals((g) => g.map((x) => x.id === id ? recalc(x, x.current + amount) : x));
  }, []);

  return {
    goals, isAddVisible, selectedGoal, poolTotal, asignado, disponible,
    handleAnadir, handleCloseAdd, handleCreate,
    handleCardPress, handleCloseEdit, handleSave, handleDelete,
    handleWithdraw, handleDeposit,
  };
}
