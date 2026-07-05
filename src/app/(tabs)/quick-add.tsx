/**
 * QuickAddTab — Route (thin wrapper)
 *
 * @what  Tab M02 — Quick Add. Compone `jars` (useJars) y las listas planificadas (useLists, store
 *        compartido → mapeadas a PickableList) y delega a QuickAddScreen. El mapeo y el puente
 *        markPurchased viven acá (composition root) para que transactions/ no importe planner/.
 * @returns JSX — QuickAddScreen.
 */
import { useMemo } from 'react';

import { useJars } from '@features/jars/hooks/useJars';
import { useLists } from '@features/planner/hooks/useLists';
import { QuickAddScreen } from '@features/transactions/components/quick-add/QuickAddScreen';
import type { PickableList } from '@features/transactions/types';

export default function QuickAddTab() {
  const { jars } = useJars();
  const { listas: sourceListas, markPurchased } = useLists();

  const listas: PickableList[] = useMemo(
    () => sourceListas.map((l) => ({ id: l.id, name: l.name, emoji: l.emoji, itemNames: l.items.map((i) => i.name) })),
    [sourceListas]
  );

  return <QuickAddScreen jars={jars} listas={listas} onListPurchased={markPurchased} />;
}
