/**
 * QuickAddTab — Route (thin wrapper)
 *
 * @what  Tab M02 — Quick Add. Delega toda la lógica a QuickAddScreen.
 * @returns JSX — QuickAddScreen.
 */
import { QuickAddScreen } from '@features/transactions/components/quick-add/QuickAddScreen';

export default function QuickAddTab() {
  return <QuickAddScreen />;
}
