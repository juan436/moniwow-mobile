/**
 * QuickAddTab — Route (thin wrapper)
 *
 * @what  Tab M02 — Quick Add. Lee `jars` de useDashboard y delega a QuickAddScreen.
 * @returns JSX — QuickAddScreen.
 */
import { useDashboard } from '@features/dashboard/hooks/useDashboard';
import { QuickAddScreen } from '@features/transactions/components/quick-add/QuickAddScreen';

export default function QuickAddTab() {
  const { jars } = useDashboard();
  return <QuickAddScreen jars={jars} />;
}
