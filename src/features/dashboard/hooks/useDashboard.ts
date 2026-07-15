/**
 * useDashboard — Hook
 *
 * @what     Provee datos de presentación del dashboard central.
 * @receives Ninguno.
 * @processes `saldoLibre` = balance de la jarra Libre, **derivado del libro en vivo** (C4). Antes era
 *           el literal `1285.50` escrito a mano: registrabas un ingreso y el saldo grande del
 *           dashboard no se movía, porque no miraba tus datos — miraba una constante.
 *           **`upcoming` derivado (C5).** Era `MOCK_UPCOMING`: 6 nombres inventados ("Electricidad CFE",
 *           "Gimnasio Smart Fit"…) que no existían en ninguna tabla. El Dashboard y la Agenda pedían
 *           cosas distintas: pagabas la renta en la Agenda y aquí te la seguían reclamando. Ahora
 *           ambos salen de `pendingItems` + `debts` vía `ComputeUpcoming` — **una sola verdad**.
 *           Jarras vive en features/jars/useJars, transacciones en features/transactions/useTransactions
 *           (ver ADR excepciones dashboard→jars, dashboard→transactions en clean_architecture.md).
 * @returns  { saldoLibre, upcoming, isLoading, error }
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ComputeJarBalances } from '@core/use-cases/ComputeJarBalances';
import { ComputeUpcoming } from '@core/use-cases/ComputeUpcoming';
import { agendaRepository, debtRepository, jarRepository } from '@infrastructure/container';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import { toJarPresentation, colorByType, type JarPresentation } from '@shared/styles';
import { toUpcomingExpense } from '../mappers';
import type { Debt } from '@core/entities/Debt';
import type { PendingItem } from '@core/ports/IAgendaRepository';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado
const LIBRE_JAR_ID = 'libre';
const UPCOMING_LIMIT = 6;
const FALLBACK: JarPresentation = { name: 'Libre', iconName: 'account-balance-wallet', ...colorByType('libre') };

const computeBalances = new ComputeJarBalances();
const computeUpcoming = new ComputeUpcoming();

export function useDashboard() {
  const transactions = useTransactionsStore((s) => s.transactions);
  const isLoading    = useTransactionsStore((s) => s.isLoading);
  const ledgerError  = useTransactionsStore((s) => s.error);
  const load         = useTransactionsStore((s) => s.load);

  const [pending, setPending] = useState<PendingItem[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [presById, setPresById] = useState<Map<string, JarPresentation>>(new Map());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void load(); }, [load]);

  const loadCommitments = useCallback(async () => {
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
      setError('No se pudieron cargar los próximos compromisos');
    }
  }, []);

  // Relee al crecer el libro: confirmar en la Agenda escribe una tx Y marca el compromiso. El estado
  // del compromiso vive en la BD, no aquí — sin esto el Dashboard seguiría pidiendo la renta ya pagada.
  useEffect(() => { void loadCommitments(); }, [loadCommitments, transactions.length]);

  const saldoLibre = useMemo(
    () => computeBalances.execute(transactions).get(LIBRE_JAR_ID) ?? 0,
    [transactions],
  );

  const upcoming = useMemo(() => {
    const today = new Date();
    return computeUpcoming
      .execute(pending, debts, transactions, today, UPCOMING_LIMIT)
      .map((c) => toUpcomingExpense(c, presById.get(c.jarId) ?? FALLBACK, today));
  }, [pending, debts, transactions, presById]);

  return {
    saldoLibre,
    upcoming,
    isLoading,
    error: error ?? ledgerError,
  };
}
