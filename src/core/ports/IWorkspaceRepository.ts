/**
 * IWorkspaceRepository — Port
 *
 * @what     Contrato para persistencia de workspaces (remoto y local).
 * @receives Workspace | string (id/code)
 * @processes Define las operaciones sin implementar la infraestructura.
 * @returns  Workspace | null según la operación
 */
import { Workspace, WorkspaceType } from '../entities/Workspace';

export interface IWorkspaceRepository {
  save(workspace: Workspace): Promise<void>;
  findById(id: string): Promise<Workspace | null>;
  findByOwner(ownerId: string): Promise<Workspace | null>;
  findByInviteCode(code: string): Promise<Workspace | null>;
}

export interface IWorkspaceLocalStore {
  saveActive(workspace: Workspace): Promise<void>;
  getActive(): Promise<Workspace | null>;
  clear(): Promise<void>;
}

export type { WorkspaceType };
