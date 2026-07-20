/**
 * useDashboard — Hook
 *
 * @what     Provee datos de presentación del dashboard central.
 * @receives Ninguno.
 * @processes **Todo sale de `GET /summary`**, que compone los cinco números con una sola lectura del
 *           libro del lado servidor. `saldoLibre` = el balance de la jarra Libre; `upcoming` = los
 *           próximos compromisos, la misma lista que ve la Agenda (C5: antes el Dashboard tenía su
 *           propio `MOCK_UPCOMING` y te reclamaba la renta ya pagada).
 *           Antes esto se derivaba acá con `ComputeJarBalances` y `ComputeUpcoming` sobre el libro
 *           entero en memoria. **La jarra Libre se busca por `type`, no por id**: `'libre'` como id
 *           solo funcionaba con el workspace sembrado — a un usuario nuevo, con ids UUID, este número
 *           le habría dado 0 para siempre sin un solo error en pantalla.
 *           Jarras vive en features/jars/useJars, transacciones en features/transactions/useTransactions
 *           (ver ADR excepciones dashboard→jars, dashboard→transactions en clean_architecture.md).
 * @returns  { saldoLibre, upcoming, isLoading, error }
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { summaryRepository, jarRepository } from '@infrastructure/container';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import { toJarPresentation, colorByType, type JarPresentation } from '@shared/styles';
import { toUpcomingExpense } from '../mappers';
import type { Jar } from '@core/entities/Jar';
import type { Summary } from '@core/types/Summary';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado
const UPCOMING_LIMIT = 6;
const FALLBACK: JarPresentation = { name: 'Libre', iconName: 'account-balance-wallet', ...colorByType('libre') };

export function useDashboard() {
  const transactions = useTransactionsStore((s) => s.transactions);
  const loadLedger   = useTransactionsStore((s) => s.load);

  const [summary, setSummary] = useState<Summary | null>(null);
  const [jars, setJars] = useState<Jar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void loadLedger(); }, [loadLedger]);

  const load = useCallback(async () => {
    try {
      const [s, js] = await Promise.all([
        summaryRepository.find({ upcomingLimit: UPCOMING_LIMIT }),
        jarRepository.findByWorkspace(WORKSPACE_ID),
      ]);
      setSummary(s);
      setJars(js);
      setError(null);
    } catch {
      setError('No se pudo cargar el resumen');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Relee al crecer el libro: confirmar en la Agenda escribe una tx Y marca el compromiso. Ahora los
  // números los suma el servidor, así que sin este efecto el saldo se quedaría clavado.
  useEffect(() => { void load(); }, [load, transactions.length]);

  const presById = useMemo(
    () => new Map(jars.map((j) => [j.id, toJarPresentation(j)])),
    [jars],
  );

  // Por `type`, no por id: la identidad de una jarra base es su tipo (decisión 2026-07-20).
  const saldoLibre = useMemo(() => {
    const libre = jars.find((j) => j.type === 'libre');
    return libre ? (summary?.balances.get(libre.id) ?? libre.balance) : 0;
  }, [jars, summary]);

  const upcoming = useMemo(() => {
    const today = new Date();
    return (summary?.upcoming ?? []).map((c) =>
      toUpcomingExpense(c, presById.get(c.jarId) ?? FALLBACK, today),
    );
  }, [summary, presById]);

  return { saldoLibre, upcoming, isLoading, error };
}
