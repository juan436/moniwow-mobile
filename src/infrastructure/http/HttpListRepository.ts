/**
 * HttpListRepository — Adapter (HTTP)
 *
 * @what     Implementa IListRepository contra `GET /lists`. Reemplaza a `JsonListRepository`.
 * @receives workspaceId (ignorado: viaja en el token) · jarId · id
 * @processes Traduce el JSON a entidades `List`. No hay fechas que revivir.
 * @returns  Promise<List[]> · Promise<List | null>
 *
 * **La escritura ya NO pasa por acá**: crear/borrar la lista y tocar los ítems van por `IListActions`
 * (`HttpListActions`), porque el id lo pone el servidor. Estos `save`/`update`/`delete` quedan como
 * stubs muertos que el port aún exige; se borran en el Paso 5 (limpieza de `json/`).
 */
import { List } from '@core/entities/List';
import type { ListItem } from '@core/entities/List';
import type { IListRepository } from '@core/ports/IListRepository';

import { request } from './httpClient';

/** Forma exacta del JSON. Los totales llegan calculados pero la entidad los recalcula sola. */
export interface ListDto {
  id: string;
  name: string;
  emoji: string;
  jarId: string;
  workspaceId: string;
  items: ListItem[];
}

export const toList = (dto: ListDto): List =>
  new List({
    id: dto.id,
    name: dto.name,
    emoji: dto.emoji,
    jarId: dto.jarId,
    workspaceId: dto.workspaceId,
    items: dto.items,
  });

export class HttpListRepository implements IListRepository {
  async findByWorkspace(_workspaceId: string): Promise<List[]> {
    const dtos = await request<ListDto[]>('/lists');
    return dtos.map(toList);
  }

  /** No hay filtro por jarra en la API: se filtra sobre la lista completa, que es corta. */
  async findByJar(jarId: string): Promise<List[]> {
    const lists = await this.findByWorkspace('');
    return lists.filter((l) => l.jarId === jarId);
  }

  async findById(id: string): Promise<List | null> {
    const lists = await this.findByWorkspace('');
    return lists.find((l) => l.id === id) ?? null;
  }

  async save(_list: List): Promise<void> {
    throw new Error('Stub muerto: crear lista va por IListActions.create, no por el repo');
  }

  async update(_list: List): Promise<void> {
    throw new Error('Stub muerto: mutar una lista va por IListActions, no por el repo');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Stub muerto: borrar lista va por IListActions.remove, no por el repo');
  }
}
