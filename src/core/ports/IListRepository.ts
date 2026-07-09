import { List } from '../entities/List';

export interface IListRepository {
  findById(id: string): Promise<List | null>;
  findByWorkspace(workspaceId: string): Promise<List[]>;
  findByJar(jarId: string): Promise<List[]>;
  save(list: List): Promise<void>;
  update(list: List): Promise<void>;
  delete(id: string): Promise<void>;
}
