/**
 * useJars — Hook
 *
 * @what     Wrapper sobre `useJarsStore` (Zustand). Mantiene la firma que ya consumen
 *           JarsScreen/DashboardScreen/modales, pero los datos salen del repositorio — no de una
 *           lista hardcodeada. Reglas de protección viven en el store + dominio (jarCapabilities).
 * @receives Ninguno.
 * @processes Hidrata jarras y libro al montar. **El balance se deriva del libro EN VIVO**
 *           (`ComputeJarBalances` sobre `transactionsStore`): al registrar un gasto en Quick Add, la
 *           jarra baja sola, sin recargar nada. Si se leyera el balance de una foto tomada al
 *           arrancar, un gasto nuevo no movería el número.
 * @returns  { jars, isLoading, error, handleCreate, handleSave, handleDelete, handleTransfer }
 */
import { useEffect, useMemo } from 'react';

import { ComputeJarBalances } from '@core/use-cases/ComputeJarBalances';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import { useJarsStore } from '../stores/jarsStore';
import { toJarDisplay } from '../mappers';

const computeBalances = new ComputeJarBalances();

export function useJars() {
  const entities       = useJarsStore((s) => s.jars);
  const isLoading      = useJarsStore((s) => s.isLoading);
  const error          = useJarsStore((s) => s.error);
  const loadJars       = useJarsStore((s) => s.load);
  const handleCreate   = useJarsStore((s) => s.create);
  const handleSave     = useJarsStore((s) => s.save);
  const handleDelete   = useJarsStore((s) => s.remove);
  const handleTransfer = useJarsStore((s) => s.transfer);

  const transactions = useTransactionsStore((s) => s.transactions);
  const loadLedger   = useTransactionsStore((s) => s.load);

  useEffect(() => {
    void loadJars();
    void loadLedger();
  }, [loadJars, loadLedger]);

  const jars = useMemo(() => {
    const balances = computeBalances.execute(transactions);
    return entities.map((jar) => toJarDisplay(jar, balances.get(jar.id) ?? 0));
  }, [entities, transactions]);

  return { jars, isLoading, error, handleCreate, handleSave, handleDelete, handleTransfer };
}
