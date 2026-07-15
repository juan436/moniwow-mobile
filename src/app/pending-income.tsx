/**
 * PendingIncomeRoute — Route (thin wrapper)
 *
 * @what     Ruta /pending-income — ingresos por confirmar. Delega en PendingIncomeScreen (planner).
 * @returns  JSX — PendingIncomeScreen.
 */
import { PendingIncomeScreen } from '@features/planner/components/pending-income/PendingIncomeScreen';

export default function PendingIncomeRoute() {
  return <PendingIncomeScreen />;
}
