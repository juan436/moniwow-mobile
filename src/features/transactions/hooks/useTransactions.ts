/**
 * useTransactions — Hook
 *
 * @what     Historial de movimientos DERIVADO de la BD. Lee entidades `Transaction` de
 *           `transactionRepository` + presentación de las jarras (`jarRepository`), y las mapea a
 *           `TransactionDisplay`. Antes: mock inline con ícono/color por transacción. Ahora: fuente
 *           única (una colección) → ícono/color se derivan de la jarra dueña.
 * @receives Ninguno.
 * @processes Carga tx + jarras en paralelo, arma mapa jarId→presentación, mapea cada tx a Display.
 * @returns  { transactions: TransactionDisplay[], isLoading, error }
 */
import { useEffect, useState } from 'react';

import { transactionRepository, jarRepository } from '@infrastructure/container';
import { toJarPresentation, colorByType, type JarPresentation } from '@shared/styles';
import { toTransactionDisplay } from '../mappers';
import type { TransactionDisplay } from '../types';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado
const FALLBACK: JarPresentation = { name: 'Sin jarra', iconName: 'help-outline', ...colorByType('custom') };

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setIsLoading(true);
        const [txs, jars] = await Promise.all([
          transactionRepository.findByWorkspace(WORKSPACE_ID),
          jarRepository.findByWorkspace(WORKSPACE_ID),
        ]);
        const presById = new Map(jars.map((j) => [j.id, toJarPresentation(j)]));
        const display = txs.map((t, i) =>
          toTransactionDisplay(t, presById.get(t.jarId) ?? FALLBACK, i === txs.length - 1),
        );
        if (active) setTransactions(display);
      } catch {
        if (active) setError('No se pudieron cargar los movimientos');
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return { transactions, isLoading, error };
}
