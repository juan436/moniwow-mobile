/**
 * HttpListRepository — Adapter (HTTP)
 *
 * @what     Implementa IListRepository contra `GET /lists`. Reemplaza a `JsonListRepository`.
 * @receives workspaceId (ignorado: viaja en el token) · jarId · id
 * @processes Traduce el JSON a entidades `List`. No hay fechas que revivir.
 * @returns  Promise<List[]> · Promise<List | null>
 *
 * **Ojo, esto le pega a las listas de compra**: marcar un ítem, añadirlo o limpiar la lista pasan hoy
 * por `listsStore` → `update()`, y acá eso lanza. Las listas se quedarán en modo lectura hasta que la
 * API tenga su CRUD — es el dominio que más escritura tiene de los cinco.
 */
import { List } from '@core/entities/List';
import type { ListItem } from '@core/entities/List';
import type { IListRepository } from '@core/ports/IListRepository';

import { request } from './httpClient';

/** Forma exacta del JSON. Los totales llegan calculados pero la entidad los recalcula sola. */
interface ListDto {
  id: string;
  name: string;
  emoji: string;
  jarId: string;
  workspaceId: string;
  items: ListItem[];
}

const toList = (dto: ListDto): List =>
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
    throw new Error('Crear lista todavía no existe en la API (falta POST /lists)');
  }

  async update(_list: List): Promise<void> {
    throw new Error(
      'Cambiar una lista (marcar ítem, añadir, limpiar) todavía no existe en la API (falta PATCH /lists/:id)',
    );
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Borrar lista todavía no existe en la API (falta DELETE /lists/:id)');
  }
}
