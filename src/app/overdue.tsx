/**
 * OverdueRoute — Route (thin wrapper)
 *
 * @what     Ruta /overdue — pagos y deudas atrasados. Delega en OverdueScreen (feature planner).
 * @processes Compone `reload` de `useJars()` (FB-013): esta pantalla tiene su propia instancia de
 *           `usePlanner`, separada de la de Agenda — sin pasarlo acá, confirmar un atrasado desde
 *           esta ruta no refrescaba el balance de la jarra.
 * @returns  JSX — OverdueScreen.
 */
import { useJars } from '@features/jars/hooks/useJars';
import { OverdueScreen } from '@features/planner/components/overdue/OverdueScreen';

export default function OverdueRoute() {
  const { reload } = useJars();
  return <OverdueScreen onJarsChanged={reload} />;
}
