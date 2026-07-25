/**
 * useAudit — Hook
 *
 * @what     Provee datos de presentación para el tab Revisión (carrusel 4 páginas). Revisión no tiene
 *           datos propios — es una vista.
 * @receives Ninguno.
 * @processes **Los números salen de `GET /summary`**: `patrimonio`, `barChart` (ingresos vs gastos por
 *           mes, sin transferencias) y `distribution` (gasto del mes por jarra). Antes se derivaban
 *           acá con `ComputeJarBalances`/`ComputeMonthlyTotals`/`ComputeSpendingByJar` sobre el libro
 *           entero; los tres sumaban las mismas 359 transacciones tres veces.
 *           Metas ← `goalRepository` (misma colección que el tab Metas → un solo número). Deudas ←
 *           `debtRepository`, que **ya trae el estado de cada una** (cuotas pagadas, atrasadas): eso
 *           lo cruza el servidor con el libro.
 *           **Fugas es interino**: hoy lista los gastos hormiga del mes, ordenados por monto, sin
 *           agrupar. Agrupar por categoría exige que la IA etiquete cada gasto (M09) — inventar la
 *           categoría aquí sería mentir. `isHormiga` lo decide la transacción, no un id de jarra.
 *           **Refetch al enfocar (FB-014):** Aportar a una meta no toca el libro (reasigna el pozo,
 *           `useGoals.handleDeposit` en la screen de Metas) → el `transactions.length` de acá nunca
 *           cambia y `goalsTotal` quedaba viejo hasta recargar la app entera. Dashboard y Revisión
 *           montan esta hook cada uno por su lado (sin store compartido de metas) — `useFocusEffect`
 *           relee al volver a cualquiera de las dos pantallas, sin acoplar Metas con Dashboard/Audit.
 * @returns  Datos para las 4 páginas del carrusel + selectedMonth/onSelectMonth + isLoading + error.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { monthKey } from '@core/utils/monthKey';
import { goalRepository, debtRepository, jarRepository, summaryRepository } from '@infrastructure/container';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import { toJarPresentation, colorByType, type JarPresentation } from '@shared/styles';
import { toGoalDisplay, toDebtBreakdown, toBarChartEntry, toDistribution, toLeakDisplay } from '../mappers';
import type { DebtWithStatus } from '@core/types/DebtStatus';
import type { Summary } from '@core/types/Summary';
import type { GoalDisplay } from '../types';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado
const CHART_MONTHS = 12;
const FALLBACK: JarPresentation = { name: 'Libre', iconName: 'account-balance-wallet', ...colorByType('libre') };

export function useAudit() {
  const [goals, setGoals] = useState<GoalDisplay[]>([]);
  const [debts, setDebts] = useState<DebtWithStatus[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [presById, setPresById] = useState<Map<string, JarPresentation>>(new Map());
  const [pickedMonth, setPickedMonth] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const transactions = useTransactionsStore((s) => s.transactions);
  const loadLedger   = useTransactionsStore((s) => s.load);

  useEffect(() => { void loadLedger(); }, [loadLedger]);

  const patrimonio = summary?.patrimonio ?? 0;
  const barChart = useMemo(() => (summary?.monthlyTotals ?? []).map(toBarChartEntry), [summary]);

  // Mes activo: el que el usuario tocó, o el último con datos.
  const selectedMonth = pickedMonth ?? barChart[barChart.length - 1]?.key ?? monthKey(new Date());

  // `month` pide a la API el reparto de gasto de ESE mes (card Distribución). `monthlyTotals` NO
  // depende del mes, así que `barChart` —y con él `selectedMonth`— salen iguales entre fetches: sin
  // bucle. Antes solo llegaba el mes en curso y otro mes salía vacío.
  const loadCollections = useCallback(async () => {
    try {
      const [gs, ds, jars, s] = await Promise.all([
        goalRepository.findByWorkspace(WORKSPACE_ID),
        debtRepository.findByWorkspace(WORKSPACE_ID),
        jarRepository.findByWorkspace(WORKSPACE_ID),
        summaryRepository.find({ chartMonths: CHART_MONTHS, month: selectedMonth }),
      ]);
      setGoals(gs.map(toGoalDisplay));
      setDebts(ds);
      setPresById(new Map(jars.map((j) => [j.id, toJarPresentation(j)])));
      setSummary(s);
      setError(null);
    } catch {
      setError('No se pudo cargar la revisión');
    }
  }, [selectedMonth]);

  // Relee al crecer el libro o al cambiar de mes: los números los suma el servidor, así que pagar una
  // cuota en la Agenda no mueve nada de aquí hasta volver a preguntar.
  useEffect(() => { void loadCollections(); }, [loadCollections, transactions.length]);

  // Relee al enfocar la pantalla: cubre mutaciones que no crecen el libro (Aportar a una meta), que
  // el trigger de arriba no detecta.
  useFocusEffect(useCallback(() => { void loadCollections(); }, [loadCollections]));

  // `spendingByJar` ya es del mes elegido; el guardia solo evita el parpadeo entre fetch y `setSummary`.
  const distribution = useMemo(
    () => (summary && summary.month === selectedMonth
      ? toDistribution(summary.spendingByJar, presById)
      : []),
    [summary, selectedMonth, presById],
  );

  const fugas = useMemo(
    () => transactions
      .filter((t) => t.isHormiga && monthKey(t.date) === selectedMonth)
      .sort((a, b) => b.amount - a.amount)
      .map((t) => toLeakDisplay(t, presById.get(t.jarId) ?? FALLBACK)),
    [transactions, selectedMonth, presById],
  );

  const onSelectMonth = useCallback((key: string) => setPickedMonth(key), []);

  // Metas derivadas: un solo número, mismo origen que el tab Metas.
  const goalsTotal   = useMemo(() => goals.reduce((s, g) => s + g.current, 0), [goals]);
  const metaGlobal   = useMemo(() => goals.reduce((s, g) => s + g.target, 0), [goals]);
  const goalProgress = metaGlobal === 0 ? 0 : Math.round((goalsTotal / metaGlobal) * 100);

  // **`deudaTotal` es lo que AÚN DEBES**, no la suma de lo que pediste. Antes era Σ `amount` (el
  // importe original): pagabas cuotas y el número no se movía nunca. Cuántas cuotas llevas lo cuenta
  // el SERVIDOR desde el libro, no un campo guardado.
  const vivas          = useMemo(() => debts.filter(({ status }) => !status.isPaid), [debts]);
  const deudaBreakdown = useMemo(() => vivas.map(({ debt, status }) => toDebtBreakdown(debt, status)), [vivas]);
  const deudaTotal     = useMemo(() => vivas.reduce((s, { status }) => s + status.remaining, 0), [vivas]);
  const deudaOriginal  = useMemo(() => debts.reduce((s, { debt }) => s + debt.amount, 0), [debts]);
  const pagado         = deudaOriginal - deudaTotal;
  const deudaPagada    = deudaOriginal === 0 ? 0 : Math.round((pagado / deudaOriginal) * 100);

  return {
    barChart, fugas, distribution, selectedMonth, onSelectMonth,
    patrimonio,
    deudaTotal, deudaOriginal, deudaPagada, deudaBreakdown,
    goalProgress, goalsTotal, metaGlobal, goals,
    isLoading: false,
    error,
  };
}
