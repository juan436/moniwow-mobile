/**
 * useJars — Hook
 *
 * @what     Wrapper sobre `useJarsStore` (Zustand). Mantiene la firma que ya consumen
 *           JarsScreen/DashboardScreen/modales. Reglas de protección viven en el store + dominio
 *           (jarCapabilities).
 * @receives Ninguno.
 * @processes Hidrata jarras al montar. **El balance llega calculado por el servidor** (`GET /jars` lo
 *           deriva del libro allá). Antes se recalculaba acá con `ComputeJarBalances` sobre el libro
 *           entero en memoria: para saber cuánto había en Hogar, el teléfono se bajaba las 359
 *           transacciones. Lo que se pierde es el refresco instantáneo al escribir; lo repone
 *           `reload()`, que quien escribe llama después — el número lo dice quien lo calcula.
 * @returns  { jars, isLoading, error, reload, handleCreate, handleSave, handleDelete, handleTransfer }
 */
import { useEffect } from 'react';
import { useMemo } from 'react';

import { useJarsStore } from '../stores/jarsStore';
import { toJarDisplay } from '../mappers';

export function useJars() {
  const entities       = useJarsStore((s) => s.jars);
  const isLoading      = useJarsStore((s) => s.isLoading);
  const error          = useJarsStore((s) => s.error);
  const loadJars       = useJarsStore((s) => s.load);
  const reload         = useJarsStore((s) => s.reload);
  const handleCreate   = useJarsStore((s) => s.create);
  const handleSave     = useJarsStore((s) => s.save);
  const handleDelete   = useJarsStore((s) => s.remove);
  const handleTransfer = useJarsStore((s) => s.transfer);

  useEffect(() => { void loadJars(); }, [loadJars]);

  const jars = useMemo(() => entities.map((jar) => toJarDisplay(jar, jar.balance)), [entities]);

  return { jars, isLoading, error, reload, handleCreate, handleSave, handleDelete, handleTransfer };
}
