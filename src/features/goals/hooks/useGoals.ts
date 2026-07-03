/**
 * useGoals — Hook
 *
 * @what     Estado y datos mock de la feature Metas (M10): lista de metas + modales crear/editar.
 * @receives —
 * @processes Mock hasta conectar backend. CRUD local: crear, editar, eliminar meta. Modelo "pozo
 *           financiado, luego repartido" (decisión 2026-07-03): `poolTotal` es el saldo de la jarra
 *           Metas (se financia con Transferir desde Libre — no wireado aún, mismo límite mock-stage
 *           que TransferSheet de jars/); `asignado` es la suma de `current` de todas las metas;
 *           `disponible = poolTotal - asignado` es lo que queda para repartir. handleDeposit
 *           (Aportar) mueve de disponible → una meta (`poolTotal` no cambia, solo se reasigna).
 *           handleWithdraw (Slider de Sacrificio) saca dinero de una meta Y de `poolTotal` — ese
 *           dinero sale de Metas hacia Libre de verdad, no vuelve a quedar disponible.
 * @returns  { goals, isAddVisible, selectedGoal, poolTotal, asignado, disponible, handleAnadir,
 *            handleCloseAdd, handleCreate, handleCardPress, handleCloseEdit, handleSave,
 *            handleDelete, handleWithdraw, handleDeposit }
 */
import { useCallback, useMemo, useState } from 'react';

import type { GoalItem, CreateGoalData, SaveGoalData } from '../types';

function recalc(goal: GoalItem, current: number): GoalItem {
  return { ...goal, current, progress: Math.min(100, Math.round((current / goal.target) * 100)) };
}

const POOL_TOTAL_INITIAL = 50000;

const INITIAL_GOALS: GoalItem[] = [
  { id: '1', emoji: '🚗', name: 'Mi Carro Nuevo',   statusLabel: 'Progreso Constante', current: 4000,  target: 10000,  progress: 40 },
  { id: '2', emoji: '✈️', name: 'Viaje a Japón',    statusLabel: 'Apenas comenzando',  current: 500,   target: 5000,   progress: 10 },
  { id: '3', emoji: '🏠', name: 'Fondo Casa',        statusLabel: 'Vas muy bien',       current: 25000, target: 50000,  progress: 50 },
  { id: '4', emoji: '💻', name: 'MacBook Pro',       statusLabel: '¡Ya casi!',          current: 3200,  target: 3500,   progress: 91 },
  { id: '5', emoji: '🎓', name: 'Maestría',          statusLabel: 'En camino',          current: 6000,  target: 20000,  progress: 30 },
  { id: '6', emoji: '🏖️', name: 'Vacaciones Caribe', statusLabel: 'Soñando despierto',  current: 200,   target: 4000,   progress: 5  },
  { id: '7', emoji: '💍', name: 'Anillo de Compromiso', statusLabel: 'Guardando en secreto', current: 1800, target: 3000, progress: 60 },
  { id: '8', emoji: '🛵', name: 'Moto Eléctrica',   statusLabel: 'Progreso Constante', current: 900,   target: 2500,   progress: 36 },
];

export function useGoals() {
  const [goals, setGoals] = useState<GoalItem[]>(INITIAL_GOALS);
  const [poolTotal, setPoolTotal] = useState(POOL_TOTAL_INITIAL);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);

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
