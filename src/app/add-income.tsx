/**
 * AddIncomeRoute — Route (thin wrapper)
 *
 * @what  Ruta M02 — Registro de Ingreso. Lee `jars` de useJars y delega a AddIncomeScreen.
 * @returns JSX — AddIncomeScreen.
 */
import { useJars } from '@features/jars/hooks/useJars';
import { AddIncomeScreen } from '@features/transactions/components/add-income/AddIncomeScreen';

export default function AddIncomeRoute() {
  const { jars, reload } = useJars();
  return <AddIncomeScreen jars={jars} onWritten={reload} />;
}
