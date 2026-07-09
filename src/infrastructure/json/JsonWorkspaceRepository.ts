/**
 * JsonWorkspaceRepository — Adapter (mock)
 *
 * @what     Implementa IWorkspaceRepository desde `db/workspaces.json`. Estado en memoria
 *           (mock-stage). Los seeds no traen invite code → findByInviteCode devuelve null.
 */
import { Workspace, WorkspaceProps } from '@core/entities/Workspace';
import { IWorkspaceRepository } from '@core/ports/IWorkspaceRepository';
import seed from '../db/workspaces.json';

const toWorkspace = (row: WorkspaceProps): Workspace => new Workspace(row);

export class JsonWorkspaceRepository implements IWorkspaceRepository {
  private workspaces: Workspace[] = (seed as unknown as WorkspaceProps[]).map(toWorkspace);

  async save(workspace: Workspace): Promise<void> {
    this.workspaces = [...this.workspaces, workspace];
  }
  async findById(id: string): Promise<Workspace | null> {
    return this.workspaces.find((w) => w.id === id) ?? null;
  }
  async findByOwner(ownerId: string): Promise<Workspace | null> {
    return this.workspaces.find((w) => w.ownerId === ownerId) ?? null;
  }
  async findByInviteCode(_code: string): Promise<Workspace | null> {
    return null;
  }
}
