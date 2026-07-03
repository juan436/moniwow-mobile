/**
 * MetasTransferirRoute — Screen (app route)
 *
 * @what Wrapper expo-router del selector de retiro de Metas. Se llega tocando "Transferir" en
 *       GoalsJarModal (jarra Metas). Renderiza GoalsTransferScreen.
 */
import { GoalsTransferScreen } from '@features/goals/components/GoalsTransferScreen';

export default function MetasTransferirRoute() {
  return <GoalsTransferScreen />;
}
