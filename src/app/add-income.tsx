/**
 * AddIncomeRoute — Route (thin wrapper)
 *
 * @what  Ruta M02 — Registro de Ingreso. Lee `jars` de useDashboard y delega a AddIncomeScreen.
 * @returns JSX — AddIncomeScreen.
 */
import { useDashboard } from '@features/dashboard/hooks/useDashboard';
import { AddIncomeScreen } from '@features/transactions/components/add-income/AddIncomeScreen';

export default function AddIncomeRoute() {
  const { jars } = useDashboard();
  return <AddIncomeScreen jars={jars} />;
}
