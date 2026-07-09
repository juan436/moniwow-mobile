/**
 * useJars — Hook
 *
 * @what     Wrapper delgado sobre `useJarsStore` (Zustand). Mantiene la firma que ya consumen
 *           JarsScreen/DashboardScreen/modales, pero el estado ahora es único y compartido — no más
 *           copias locales por pantalla. Reglas de protección viven en el store + dominio (jarCapabilities).
 * @receives Ninguno.
 * @returns  { jars, isLoading, error, handleCreate, handleSave, handleDelete, handleTransfer }
 */
import { useJarsStore } from '../stores/jarsStore';

export function useJars() {
  const jars           = useJarsStore((s) => s.jars);
  const handleCreate   = useJarsStore((s) => s.create);
  const handleSave     = useJarsStore((s) => s.save);
  const handleDelete   = useJarsStore((s) => s.remove);
  const handleTransfer = useJarsStore((s) => s.transfer);

  return { jars, isLoading: false, error: null as string | null, handleCreate, handleSave, handleDelete, handleTransfer };
}
