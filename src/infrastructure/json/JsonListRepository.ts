/**
 * JsonListRepository — Adapter (mock)
 *
 * @what     Implementa IListRepository desde `db/lists.json`. Estado en memoria (mock-stage).
 *           Sustituye a listsStore (useSyncExternalStore) al migrar la feature (paso 7).
 */
import { List, ListProps } from '@core/entities/List';
import { IListRepository } from '@core/ports/IListRepository';
import seed from '../db/lists.json';

const toList = (row: ListProps): List => new List(row);

export class JsonListRepository implements IListRepository {
  private lists: List[] = (seed as unknown as ListProps[]).map(toList);

  async findById(id: string): Promise<List | null> {
    return this.lists.find((l) => l.id === id) ?? null;
  }
  async findByWorkspace(workspaceId: string): Promise<List[]> {
    return this.lists.filter((l) => l.workspaceId === workspaceId);
  }
  async findByJar(jarId: string): Promise<List[]> {
    return this.lists.filter((l) => l.jarId === jarId);
  }
  async save(list: List): Promise<void> {
    this.lists = [...this.lists, list];
  }
  async update(list: List): Promise<void> {
    this.lists = this.lists.map((l) => (l.id === list.id ? list : l));
  }
  async delete(id: string): Promise<void> {
    this.lists = this.lists.filter((l) => l.id !== id);
  }
}
