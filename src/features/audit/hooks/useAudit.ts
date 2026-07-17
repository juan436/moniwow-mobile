/**
 * useAudit — Hook
 *
 * @what     Provee datos de presentación para el tab Revisión (carrusel 4 páginas). **Ya no hay
 *           mocks: todo se deriva** (C6 cerrado). Revisión no tiene datos propios — es una vista.
 * @receives Ninguno.
 * @processes Metas ← `goalRepository` (misma colección que el tab Metas → un solo número). Deudas ←
 *           `debtRepository`. Del LIBRO (`transactionsStore`) se derivan: `patrimonio` (Σ balances),
 *           `barChart` (ingresos vs gastos por mes, sin transferencias, últimos 6 meses CON datos),
 *           `distribution` (gasto del mes por jarra — un solo eje) y `fugas`.
 *           **Fugas es interino**: hoy lista los gastos de Libre del mes, ordenados por monto, sin
 *           agrupar. Agrupar por categoría exige que la IA etiquete cada gasto (M09) — inventar la
 *           categoría aquí sería mentir.
 * @returns  Datos para las 4 páginas del carrusel + selectedMonth/onSelectMonth + isLoading + error.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ComputeDebtStatus } from '@core/use-cases/ComputeDebtStatus';
import { ComputeJarBalances } from '@core/use-cases/ComputeJarBalances';
import { ComputeMonthlyTotals, monthKey } from '@core/use-cases/ComputeMonthlyTotals';
import { ComputeSpendingByJar } from '@core/use-cases/ComputeSpendingByJar';
import { goalRepository, debtRepository, jarRepository } from '@infrastructure/container';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import { toJarPresentation, colorByType, type JarPresentation } from '@shared/styles';
import { toGoalDisplay, toDebtBreakdown, toBarChartEntry, toDistribution, toLeakDisplay } from '../mappers';
import type { Debt } from '@core/entities/Debt';
import type { GoalDisplay } from '../types';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado
const LIBRE_JAR_ID = 'libre';
const CHART_MONTHS = 12;
const FALLBACK: JarPresentation = { name: 'Libre', iconName: 'account-balance-wallet', ...colorByType('libre') };

const computeBalances   = new ComputeJarBalances();
const computeDebtStatus = new ComputeDebtStatus();
const computeMonthly  = new ComputeMonthlyTotals();
const computeSpending = new ComputeSpendingByJar();

export function useAudit() {
  const [goals, setGoals] = useState<GoalDisplay[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [presById, setPresById] = useState<Map<string, JarPresentation>>(new Map());
  const [pickedMonth, setPickedMonth] = useState<string | null>(null);

  const transactions = useTransactionsStore((s) => s.transactions);
  const loadLedger   = useTransactionsStore((s) => s.load);

  useEffect(() => { void loadLedger(); }, [loadLedger]);

  const loadCollections = useCallback(async () => {
    const [gs, ds, jars] = await Promise.all([
      goalRepository.findByWorkspace(WORKSPACE_ID),
      debtRepository.findByWorkspace(WORKSPACE_ID),
      jarRepository.findByWorkspace(WORKSPACE_ID),
    ]);
    setGoals(gs.map(toGoalDisplay));
    setDebts([...ds]); // copia: la referencia del repo muta in-place y React no vería el cambio
    setPresById(new Map(jars.map((j) => [j.id, toJarPresentation(j)])));
  }, []);

  // Relee al crecer el libro. `patrimonio` ya era reactivo (mira el libro), pero `debts` y `goals`
  // eran una FOTO del montaje: pagabas una cuota en la Agenda y la barra de deuda de aquí no se
  // movía hasta remontar la pantalla. Todo lo que confirma un compromiso escribe una transacción.
  useEffect(() => { void loadCollections(); }, [loadCollections, transactions.length]);

  // Patrimonio = Σ balances de jarra. Las transferencias se anulan solas.
  const patrimonio = useMemo(() => {
    const balances = computeBalances.execute(transactions);
    return [...balances.values()].reduce((sum, b) => sum + b, 0);
  }, [transactions]);

  const barChart = useMemo(
    () => computeMonthly.execute(transactions, CHART_MONTHS).map(toBarChartEntry),
    [transactions],
  );

  // Mes activo: el que el usuario tocó, o el último con datos.
  const selectedMonth = pickedMonth ?? barChart[barChart.length - 1]?.key ?? monthKey(new Date());

  const distribution = useMemo(
    () => toDistribution(computeSpending.execute(transactions, selectedMonth), presById),
    [transactions, selectedMonth, presById],
  );

  // Interino: gastos de Libre del mes, de mayor a menor. Sin agrupar (la categoría la pondrá la IA).
  const fugas = useMemo(
    () => transactions
      .filter((t) => t.isHormiga() && monthKey(t.date) === selectedMonth)
      .sort((a, b) => b.amount - a.amount)
      .map((t) => toLeakDisplay(t, presById.get(LIBRE_JAR_ID) ?? FALLBACK)),
    [transactions, selectedMonth, presById],
  );

  const onSelectMonth = useCallback((key: string) => setPickedMonth(key), []);

  // Metas derivadas: un solo número, mismo origen que el tab Metas.
  const goalsTotal   = useMemo(() => goals.reduce((s, g) => s + g.current, 0), [goals]);
  const metaGlobal   = useMemo(() => goals.reduce((s, g) => s + g.target, 0), [goals]);
  const goalProgress = metaGlobal === 0 ? 0 : Math.round((goalsTotal / metaGlobal) * 100);

  // Deudas derivadas de `debts` × el LIBRO (misma fuente que la agenda).
  // **`deudaTotal` es lo que AÚN DEBES**, no la suma de lo que pediste. Antes era Σ `amount` (el
  // importe original): pagabas cuotas y el número no se movía nunca, y una deuda ya saldada seguía
  // sumando de por vida. Lo que pediste es historia; lo que debes es el dato.
  // Cuántas cuotas llevas se CUENTA del libro (`ComputeDebtStatus`), no de un campo guardado.
  const vivas = useMemo(() => {
    const today = new Date();
    return debts
      .map((debt) => ({ debt, status: computeDebtStatus.execute(debt, transactions, today) }))
      .filter(({ status }) => !status.isPaid);
  }, [debts, transactions]);

  const deudaBreakdown = useMemo(() => vivas.map(({ debt, status }) => toDebtBreakdown(debt, status)), [vivas]);
  const deudaTotal     = useMemo(() => vivas.reduce((s, { status }) => s + status.remaining, 0), [vivas]);
  const deudaOriginal  = useMemo(() => debts.reduce((s, d) => s + d.amount, 0), [debts]);
  const pagado         = deudaOriginal - deudaTotal;
  const deudaPagada    = deudaOriginal === 0 ? 0 : Math.round((pagado / deudaOriginal) * 100);

  return {
    barChart, fugas, distribution, selectedMonth, onSelectMonth,
    patrimonio,
    deudaTotal, deudaOriginal, deudaPagada, deudaBreakdown,
    goalProgress, goalsTotal, metaGlobal, goals,
    isLoading: false,
    error: null as string | null,
  };
}
