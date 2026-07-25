/**
 * MetasTransferirRoute — Screen (app route)
 *
 * @what Wrapper expo-router del selector de retiro de Metas. Se llega tocando "Transferir" en
 *       GoalsJarSheet (jarra Metas). Renderiza GoalsTransferScreen. Compone `useJars().reload`
 *       (FB-015) — retirar mueve Metas → Libre y `jarsStore` no se entera solo.
 */
import { useJars } from '@features/jars/hooks/useJars';
import { GoalsTransferScreen } from '@features/goals/components/GoalsTransferScreen';

export default function GoalsTransferRoute() {
  const { reload } = useJars();
  return <GoalsTransferScreen onJarsChanged={reload} />;
}
