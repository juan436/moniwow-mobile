/**
 * HttpListActions — Adapter (HTTP)
 *
 * @what     Implementa IListActions contra `/lists` y el subrecurso `/lists/:id/items`.
 * @receives Los datos de cada gesto (sin ids de servidor).
 * @processes Traduce el JSON de vuelta con el MISMO mapper que `GET /lists` (`toList`), así hay una
 *           sola traducción. Cada mutación devuelve la lista fresca; `remove` no trae cuerpo (204).
 * @returns  Promise<List> · Promise<void>
 *
 * Los errores del dominio llegan como `HttpError` con el mensaje de la API (en español, ya legible).
 */
import type { List } from '@core/entities/List';
import type { CreateListInput, IListActions } from '@core/ports/IListActions';

import { toList, type ListDto } from './HttpListRepository';
import { request } from './httpClient';

export class HttpListActions implements IListActions {
  async create(input: CreateListInput): Promise<List> {
    const dto = await request<ListDto>('/lists', { method: 'POST', body: input });
    return toList(dto);
  }

  async remove(listId: string): Promise<void> {
    await request<void>(`/lists/${listId}`, { method: 'DELETE' });
  }

  async addItem(listId: string, name: string, approxAmount?: number): Promise<List> {
    const body = approxAmount !== undefined ? { name, approxAmount } : { name };
    const dto = await request<ListDto>(`/lists/${listId}/items`, { method: 'POST', body });
    return toList(dto);
  }

  async setItemChecked(listId: string, itemId: string, isChecked: boolean): Promise<List> {
    const dto = await request<ListDto>(`/lists/${listId}/items/${itemId}`, {
      method: 'PATCH',
      body: { isChecked },
    });
    return toList(dto);
  }

  async removeItem(listId: string, itemId: string): Promise<List> {
    const dto = await request<ListDto>(`/lists/${listId}/items/${itemId}`, { method: 'DELETE' });
    return toList(dto);
  }

  async setAll(listId: string, isChecked: boolean): Promise<List> {
    const dto = await request<ListDto>(`/lists/${listId}/set-all`, {
      method: 'POST',
      body: { isChecked },
    });
    return toList(dto);
  }
}
