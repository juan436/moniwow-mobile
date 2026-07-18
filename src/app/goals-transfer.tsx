/**
 * MetasTransferirRoute — Screen (app route)
 *
 * @what Wrapper expo-router del selector de retiro de Metas. Se llega tocando "Transferir" en
 *       GoalsJarSheet (jarra Metas). Renderiza GoalsTransferScreen.
 */
import { GoalsTransferScreen } from '@features/goals/components/GoalsTransferScreen';

export default function GoalsTransferRoute() {
  return <GoalsTransferScreen />;
}
