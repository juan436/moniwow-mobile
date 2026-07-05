/**
 * listsStore — Store (external, mock)
 *
 * @what     Estado compartido de las listas de compra entre tabs (Listas y Quick Add). Sin backend
 *           aún: vive en el módulo + se consume con useSyncExternalStore para que ambos tabs (que
 *           usan hooks separados y se montan por separado) vean y muten el MISMO estado.
 * @receives —
 * @processes Guarda `listas` y notifica a los suscriptores en cada mutación con un snapshot NUEVO
 *           (inmutable) — requisito de useSyncExternalStore para detectar el cambio. Mutadores:
 *           toggleItem (chulea/deschulea uno), clearList (deschulea todos), markPurchased (chulea
 *           todos, lo llama Quick Add al confirmar una compra hecha desde esa lista).
 * @returns  { getSnapshot, subscribe, toggleItem, clearList, markPurchased }
 */
import type { ListDisplay } from '../types';

let listas: ListDisplay[] = [
  {
    id: 'l1', emoji: '🛒', name: 'SUPERMERCADO', jarLabel: 'Hogar 🏠',
    items: [
      { id: 'li1', name: 'Leche', approxAmount: 2.50, isChecked: false },
      { id: 'li2', name: 'Huevos', approxAmount: 4.00, isChecked: false },
      { id: 'li3', name: 'Pan', approxAmount: 1.50, isChecked: true },
    ],
  },
  {
    id: 'l2', emoji: '🛠️', name: 'FERRETERÍA', jarLabel: 'Hogar 🏠',
    items: [{ id: 'li4', name: 'Bombillo Sala', isChecked: false }],
  },
  {
    id: 'l3', emoji: '👗', name: 'DESEOS', jarLabel: 'Libre 🍃',
    items: [{ id: 'li5', name: 'Zapatos Deportivos', isChecked: false }],
  },
];

const listeners = new Set<() => void>();

function set(next: ListDisplay[]) {
  listas = next;
  listeners.forEach((listener) => listener());
}

export const listsStore = {
  getSnapshot(): ListDisplay[] {
    return listas;
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  toggleItem(listId: string, itemId: string) {
    set(listas.map((l) => l.id !== listId ? l
      : { ...l, items: l.items.map((i) => i.id !== itemId ? i : { ...i, isChecked: !i.isChecked }) }));
  },
  clearList(listId: string) {
    set(listas.map((l) => l.id !== listId ? l
      : { ...l, items: l.items.map((i) => ({ ...i, isChecked: false })) }));
  },
  markPurchased(listId: string) {
    set(listas.map((l) => l.id !== listId ? l
      : { ...l, items: l.items.map((i) => ({ ...i, isChecked: true })) }));
  },
};
