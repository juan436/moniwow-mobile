/**
 * listsStore — Store (external, sobre repo)
 *
 * @what     Estado compartido de las listas de compra entre tabs (Listas y Quick Add). HIDRATA desde
 *           listRepository (fuente única) y PERSISTE cada mutación de vuelta al repo — ya no hay una
 *           lista hardcodeada aquí. Se consume con useSyncExternalStore para que ambos tabs (hooks
 *           separados, montados por separado) vean y muten el MISMO estado.
 * @receives —
 * @processes Guarda entidades `List` y publica un snapshot NUEVO (array inmutable) en cada mutación —
 *           requisito de useSyncExternalStore para detectar el cambio. Cada mutación crea una `List`
 *           nueva (no muta la vieja) y la manda a listRepository.update. `hydrate` es idempotente:
 *           carga una sola vez (el primer tab que monte). Mutadores: toggleItem, clearList,
 *           markPurchased (lo llama Quick Add al confirmar una compra hecha desde esa lista).
 * @returns  { getSnapshot, subscribe, hydrate, toggleItem, clearList, markPurchased }
 */
import { List, type ListItem } from '@core/entities/List';
import { listRepository } from '@infrastructure/container';

const WORKSPACE_ID = 'ws1';

let lists: List[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit(next: List[]) {
  lists = next;
  listeners.forEach((listener) => listener());
}

function replaceItems(listId: string, items: ListItem[]) {
  const target = lists.find((l) => l.id === listId);
  if (!target) return;
  const updated = new List({
    id: target.id, name: target.name, emoji: target.emoji,
    jarId: target.jarId, workspaceId: target.workspaceId, items,
  });
  emit(lists.map((l) => (l.id === listId ? updated : l)));
  void listRepository.update(updated);
}

export const listsStore = {
  getSnapshot(): List[] {
    return lists;
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  async hydrate(): Promise<void> {
    if (hydrated) return;
    hydrated = true;
    emit(await listRepository.findByWorkspace(WORKSPACE_ID));
  },
  toggleItem(listId: string, itemId: string) {
    const target = lists.find((l) => l.id === listId);
    if (!target) return;
    replaceItems(listId, target.items.map((i) => i.id !== itemId ? i : { ...i, isChecked: !i.isChecked }));
  },
  clearList(listId: string) {
    const target = lists.find((l) => l.id === listId);
    if (!target) return;
    replaceItems(listId, target.items.map((i) => ({ ...i, isChecked: false })));
  },
  markPurchased(listId: string) {
    const target = lists.find((l) => l.id === listId);
    if (!target) return;
    replaceItems(listId, target.items.map((i) => ({ ...i, isChecked: true })));
  },
};
