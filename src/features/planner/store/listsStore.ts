/**
 * listsStore — Store (external, sobre repo + acciones)
 *
 * @what     Estado compartido de las listas de compra entre tabs (Listas y Quick Add). HIDRATA desde
 *           listRepository (lectura) y ESCRIBE por listActions (el servidor pone los ids y devuelve la
 *           lista fresca). Se consume con useSyncExternalStore para que ambos tabs (hooks separados)
 *           vean y muten el MISMO estado.
 * @receives —
 * @processes Cada mutador es server-authoritative: llama a listActions, espera la `List` que devuelve
 *           el servidor (con sus totales recalculados) y la publica como snapshot NUEVO (array
 *           inmutable, requisito de useSyncExternalStore). Ya no arma ids con `Date.now()` ni escribe
 *           optimista: la verdad es la del backend. `hydrate` es idempotente (carga una vez).
 *           Mutadores: createList, addItem, toggleItem (manda el valor nuevo, no un flip), clearList /
 *           markPurchased (setAll false/true), deleteItem (basura por fila), deleteList (swipe).
 * @returns  { getSnapshot, subscribe, hydrate, createList, addItem, toggleItem, clearList, markPurchased, deleteItem, deleteList }
 */
import { List } from '@core/entities/List';
import { listActions, listRepository } from '@infrastructure/container';

const WORKSPACE_ID = 'ws1';

let lists: List[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit(next: List[]) {
  lists = next;
  listeners.forEach((listener) => listener());
}

/** Reemplaza una lista por la versión fresca que devolvió el servidor (fuente de verdad). */
function replaceList(updated: List) {
  emit(lists.map((l) => (l.id === updated.id ? updated : l)));
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
  async createList(name: string, emoji: string, jarId: string) {
    const list = await listActions.create({ name, emoji, jarId });
    emit([...lists, list]);
  },
  async addItem(listId: string, name: string, approxAmount?: number) {
    replaceList(await listActions.addItem(listId, name, approxAmount));
  },
  async toggleItem(listId: string, itemId: string) {
    const item = lists.find((l) => l.id === listId)?.items.find((i) => i.id === itemId);
    if (!item) return;
    replaceList(await listActions.setItemChecked(listId, itemId, !item.isChecked));
  },
  async clearList(listId: string) {
    replaceList(await listActions.setAll(listId, false));
  },
  async markPurchased(listId: string) {
    replaceList(await listActions.setAll(listId, true));
  },
  async deleteItem(listId: string, itemId: string) {
    replaceList(await listActions.removeItem(listId, itemId));
  },
  async deleteList(listId: string) {
    if (!lists.some((l) => l.id === listId)) return;
    await listActions.remove(listId);
    emit(lists.filter((l) => l.id !== listId));
  },
};
