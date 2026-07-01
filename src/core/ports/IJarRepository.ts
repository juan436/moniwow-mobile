import { Jar } from '../entities/Jar';

export interface IJarRepository {
  findById(id: string): Promise<Jar | null>;
  findByWorkspace(workspaceId: string): Promise<Jar[]>;
  save(jar: Jar): Promise<void>;
  update(jar: Jar): Promise<void>;
  delete(id: string): Promise<void>;
}
