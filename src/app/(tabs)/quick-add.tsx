/**
 * QuickAddTab — Route (thin wrapper)
 *
 * @what  Tab M02 — Quick Add. Lee `jars` de useJars y delega a QuickAddScreen.
 * @returns JSX — QuickAddScreen.
 */
import { useJars } from '@features/jars/hooks/useJars';
import { QuickAddScreen } from '@features/transactions/components/quick-add/QuickAddScreen';

export default function QuickAddTab() {
  const { jars } = useJars();
  return <QuickAddScreen jars={jars} />;
}
