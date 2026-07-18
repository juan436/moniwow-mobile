/**
 * ListDetailRoute — Route (thin wrapper)
 *
 * @what     Ruta /lista/[id] — page única de una lista de compras. Delega en ListDetailScreen.
 * @returns  JSX — ListDetailScreen (lee el id param por su cuenta).
 */
import { ListDetailScreen } from '@features/planner/components/lists/ListDetailScreen';

export default function ListDetailRoute() {
  return <ListDetailScreen />;
}
