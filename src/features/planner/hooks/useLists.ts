/**
 * useLists — Hook
 *
 * @what     Acceso reactivo al store compartido de listas de compra (listsStore), ya respaldado por
 *           listRepository.
 * @receives —
 * @processes Dispara `hydrate` al montar (idempotente) y suscribe el componente al store vía
 *           useSyncExternalStore — re-renderiza cuando cualquier tab muta las listas. Mapea las
 *           entidades `List` a `ListDisplay` (deriva la etiqueta de la jarra). Expone los mutadores
 *           del store (referencias estables, no hace falta useCallback al pasarlos como prop).
 * @returns  { listas, toggleItem, clearList, markPurchased }
 */
import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { listsStore } from '../store/listsStore';
import { toListDisplay } from '../mappers';

export function useLists() {
  useEffect(() => { void listsStore.hydrate(); }, []);

  const entities = useSyncExternalStore(listsStore.subscribe, listsStore.getSnapshot);
  const listas = useMemo(() => entities.map(toListDisplay), [entities]);

  return {
    listas,
    toggleItem: listsStore.toggleItem,
    clearList: listsStore.clearList,
    markPurchased: listsStore.markPurchased,
  };
}
