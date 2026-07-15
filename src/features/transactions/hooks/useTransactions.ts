/**
 * useTransactions — Hook
 *
 * @what     Historial de movimientos DERIVADO del libro. Lee las entidades `Transaction` del
 *           `transactionsStore` (estado compartido) + la presentación de las jarras, y las mapea a
 *           `TransactionDisplay`. Fuente única: ícono/color se derivan de la jarra dueña.
 * @receives Ninguno.
 * @processes Antes leía el repo con su propio `useEffect`: era una foto tomada al montar, y un gasto
 *           registrado en Quick Add no aparecía hasta reiniciar. Ahora el libro es estado compartido
 *           → al guardar, la lista se actualiza sola.
 * @returns  { transactions: TransactionDisplay[], isLoading, error }
 */
import { useEffect, useMemo, useState } from 'react';

import { jarRepository } from '@infrastructure/container';
import { toJarPresentation, colorByType, type JarPresentation } from '@shared/styles';
import { useTransactionsStore } from '../stores/transactionsStore';
import { toTransactionDisplay } from '../mappers';
import type { TransactionDisplay } from '../types';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado
const FALLBACK: JarPresentation = { name: 'Sin jarra', iconName: 'help-outline', ...colorByType('custom') };

export function useTransactions() {
  const txs       = useTransactionsStore((s) => s.transactions);
  const isLoading = useTransactionsStore((s) => s.isLoading);
  const error     = useTransactionsStore((s) => s.error);
  const load      = useTransactionsStore((s) => s.load);

  const [presById, setPresById] = useState<Map<string, JarPresentation>>(new Map());

  useEffect(() => {
    void load();
    let active = true;
    void jarRepository.findByWorkspace(WORKSPACE_ID).then((jars) => {
      if (active) setPresById(new Map(jars.map((j) => [j.id, toJarPresentation(j)])));
    });
    return () => {
      active = false;
    };
  }, [load]);

  const transactions = useMemo<TransactionDisplay[]>(
    () => txs.map((t, i) => toTransactionDisplay(t, presById.get(t.jarId) ?? FALLBACK, i === txs.length - 1)),
    [txs, presById],
  );

  return { transactions, isLoading, error };
}
