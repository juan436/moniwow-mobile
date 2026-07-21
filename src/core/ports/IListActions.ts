/**
 * IListActions — Port (acción)
 *
 * @what     Escritura de listas de compra. Crear/borrar la lista y tocar los ítems (subrecurso).
 * @receives Los datos de cada gesto; nunca el id (lo pone el servidor).
 * @processes Lo implementa `HttpListActions` contra `/lists` y `/lists/:id/items`.
 * @returns  La `List` fresca del servidor (con sus totales) tras cada mutación; `remove` → void.
 *
 * **Por qué un port aparte y no `IListRepository.save()`** (decisión B, 2026-07-21): el id de la lista
 * y el de cada ítem los genera el servidor, así que mobile no puede "guardar" una entidad que ya trae
 * su id. Además los ítems son un subrecurso —cada uno se toca por su ruta— para que dos personas del
 * hogar marcando a la vez no se pisen. El repo queda solo para leer.
 *
 * **`setItemChecked` recibe el valor NUEVO, no "flip"**: el cliente sabe el estado actual y manda el
 * que quiere; así dos toques concurrentes no se cancelan en el servidor.
 */
import type { List } from '../entities/List';

/** Alta de lista. El id, el workspace (token) y los ítems vacíos los pone el servidor. */
export interface CreateListInput {
  name: string;
  emoji: string;
  jarId: string;
}

export interface IListActions {
  create(input: CreateListInput): Promise<List>;
  remove(listId: string): Promise<void>;
  addItem(listId: string, name: string, approxAmount?: number): Promise<List>;
  setItemChecked(listId: string, itemId: string, isChecked: boolean): Promise<List>;
  removeItem(listId: string, itemId: string): Promise<List>;
  setAll(listId: string, isChecked: boolean): Promise<List>;
}
