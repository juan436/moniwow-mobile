/**
 * useLists — Hook
 *
 * @what     Acceso reactivo al store compartido de listas de compra (listsStore), ya respaldado por
 *           listRepository.
 * @receives —
 * @processes Dispara `hydrate` al montar (idempotente) y suscribe el componente al store vía
 *           useSyncExternalStore — re-renderiza cuando cualquier tab muta las listas. Mapea las
 *           entidades `List` a `ListDisplay` (deriva la etiqueta de la jarra) — para eso pide las
 *           jarras reales del workspace vía `useJars()` (FB-013: antes la etiqueta salía de un
 *           catálogo hardcodeado, no de la jarra real). Expone los mutadores del store (referencias
 *           estables, no hace falta useCallback al pasarlos como prop).
 * @returns  { listas, createList, addItem, toggleItem, clearList, markPurchased, deleteItem, deleteList }
 */
import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { useJars } from '@features/jars/hooks/useJars';
import { listsStore } from '../store/listsStore';
import { toListDisplay } from '../mappers';

export function useLists() {
  useEffect(() => { void listsStore.hydrate(); }, []);

  const entities = useSyncExternalStore(listsStore.subscribe, listsStore.getSnapshot);
  const { jars } = useJars();
  const jarNameById = useMemo(() => new Map(jars.map((j) => [j.id, j.name])), [jars]);
  const listas = useMemo(
    () => entities.map((list) => toListDisplay(list, jarNameById.get(list.jarId) ?? list.jarId)),
    [entities, jarNameById]
  );

  return {
    listas,
    createList: listsStore.createList,
    addItem: listsStore.addItem,
    toggleItem: listsStore.toggleItem,
    clearList: listsStore.clearList,
    markPurchased: listsStore.markPurchased,
    deleteItem: listsStore.deleteItem,
    deleteList: listsStore.deleteList,
  };
}
