/**
 * useLists — Hook
 *
 * @what     Acceso reactivo al store compartido de listas de compra (listsStore).
 * @receives —
 * @processes Suscribe el componente al store vía useSyncExternalStore — re-renderiza cuando cualquier
 *           tab muta las listas. Expone los mutadores del store (referencias estables, no hace falta
 *           useCallback al pasarlos como prop).
 * @returns  { listas, toggleItem, clearList, markPurchased }
 */
import { useSyncExternalStore } from 'react';

import { listsStore } from '../store/listsStore';

export function useLists() {
  const listas = useSyncExternalStore(listsStore.subscribe, listsStore.getSnapshot);
  return {
    listas,
    toggleItem: listsStore.toggleItem,
    clearList: listsStore.clearList,
    markPurchased: listsStore.markPurchased,
  };
}
