/**
 * PendingIncomeRoute — Route (thin wrapper)
 *
 * @what     Ruta /pending-income — ingresos por confirmar. Delega en PendingIncomeScreen (planner).
 * @processes Compone `reload` de `useJars()` (FB-013): esta pantalla tiene su propia instancia de
 *           `usePlanner`, separada de la de Agenda — sin pasarlo acá, confirmar un ingreso desde
 *           esta ruta no refrescaba el balance de la jarra.
 * @returns  JSX — PendingIncomeScreen.
 */
import { useJars } from '@features/jars/hooks/useJars';
import { PendingIncomeScreen } from '@features/planner/components/pending-income/PendingIncomeScreen';

export default function PendingIncomeRoute() {
  const { reload } = useJars();
  return <PendingIncomeScreen onJarsChanged={reload} />;
}
