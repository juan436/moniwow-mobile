/**
 * useAudit — Hook
 *
 * @what     Provee datos de presentación para el tab Revisión (carrusel 4 páginas).
 * @receives Ninguno.
 * @processes Metas = DERIVADAS de `goalRepository` (misma colección que el tab Metas → un solo número):
 *           `goals` (toGoalDisplay), `goalsTotal` (Σ current), `metaGlobal` (Σ target), `goalProgress`
 *           (Σ current / Σ target). Deudas/fugas/distribución/patrimonio/barChart siguen mock (C2/C6,
 *           pendiente derivar de debts/transactions/jars).
 * @returns  Datos para las 4 páginas del carrusel + isLoading + error.
 */
import { useEffect, useMemo, useState } from 'react';

import { goalRepository, debtRepository, jarRepository } from '@infrastructure/container';
import { toGoalDisplay, toDebtBreakdown } from '../mappers';
import { MOCK_BAR_CHART, MOCK_FUGAS, MOCK_DISTRIBUTION } from '../mocks';
import type { Debt } from '@core/entities/Debt';
import type { GoalDisplay } from '../types';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado

export function useAudit() {
  const [goals, setGoals] = useState<GoalDisplay[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [patrimonio, setPatrimonio] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([
      goalRepository.findByWorkspace(WORKSPACE_ID),
      debtRepository.findByWorkspace(WORKSPACE_ID),
      jarRepository.findByWorkspace(WORKSPACE_ID),
    ]).then(([gs, ds, jars]) => {
      if (!active) return;
      setGoals(gs.map(toGoalDisplay));
      setDebts(ds);
      setPatrimonio(jars.reduce((s, j) => s + j.balance, 0));
    });
    return () => {
      active = false;
    };
  }, []);

  // Metas derivadas: un solo número, mismo origen que el tab Metas.
  const goalsTotal   = useMemo(() => goals.reduce((s, g) => s + g.current, 0), [goals]);
  const metaGlobal   = useMemo(() => goals.reduce((s, g) => s + g.target, 0), [goals]);
  const goalProgress = metaGlobal === 0 ? 0 : Math.round((goalsTotal / metaGlobal) * 100);

  // Deudas derivadas de la colección `debts` (misma fuente que la agenda).
  const deudaBreakdown = useMemo(() => debts.map(toDebtBreakdown), [debts]);
  const deudaTotal     = useMemo(() => debts.reduce((s, d) => s + d.amount, 0), [debts]);
  const pagado         = useMemo(() => debts.reduce((s, d) => s + d.cuotaAmount() * d.paidCuotas, 0), [debts]);
  const deudaPagada    = deudaTotal === 0 ? 0 : Math.round((pagado / deudaTotal) * 100);

  return {
    barChart:      MOCK_BAR_CHART,
    fugas:         MOCK_FUGAS,
    distribution:  MOCK_DISTRIBUTION,
    patrimonio,
    deudaTotal,
    deudaPagada,
    deudaBreakdown,
    goalProgress,
    goalsTotal,
    metaGlobal,
    goals,
    isLoading: false,
    error: null as string | null,
  };
}
