/**
 * LeakDetailRoute — Route (thin wrapper)
 *
 * @what     Ruta /leak/[id] — detalle de una fuga (gasto de Libre). Delega en LeakDetailScreen (audit).
 * @returns  JSX — LeakDetailScreen (lee el id param por su cuenta).
 */
import { LeakDetailScreen } from '@features/audit/components/leak/LeakDetailScreen';

export default function LeakDetailRoute() {
  return <LeakDetailScreen />;
}
