/**
 * TransactionsRoute — Route (thin wrapper)
 *
 * @what     Ruta /transactions — todos los movimientos. Delega en TransactionsScreen (transactions).
 * @returns  JSX — TransactionsScreen.
 */
import { TransactionsScreen } from '@features/transactions/components/TransactionsScreen';

export default function TransactionsRoute() {
  return <TransactionsScreen />;
}
