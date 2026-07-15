/**
 * OverdueRoute — Route (thin wrapper)
 *
 * @what     Ruta /overdue — pagos y deudas atrasados. Delega en OverdueScreen (feature planner).
 * @returns  JSX — OverdueScreen.
 */
import { OverdueScreen } from '@features/planner/components/overdue/OverdueScreen';

export default function OverdueRoute() {
  return <OverdueScreen />;
}
