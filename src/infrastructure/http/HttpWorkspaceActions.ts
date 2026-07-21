/**
 * HttpWorkspaceActions — Adapter (HTTP)
 *
 * @what     Implementa IWorkspaceActions contra `POST /workspaces` (crear) y `POST /workspaces/join`
 *           (unirse a un hogar por código).
 * @receives create: type · join: inviteCode
 * @processes Ambos **guardan el token nuevo pisando el anterior** (como el login): el token viejo lleva
 *           `workspaceId: ''` (o el de antes) congelado dentro, y crear/unirse acaba de cambiarlo.
 *           La respuesta tiene la misma forma en los dos casos, así que un solo mapper la traduce.
 * @returns  Promise<CreatedWorkspace>
 *
 * Sustituye al use-case `CreateWorkspace` de mobile, que fabricaba un `Workspace` con
 * `id: ws_${Date.now()}` y `ownerId: 'user_local'` **y no lo guardaba en ningún sitio**.
 */
import { User } from '@core/entities/User';
import type { UserRole } from '@core/entities/User';
import { Workspace } from '@core/entities/Workspace';
import type { WorkspaceType } from '@core/entities/Workspace';
import type { CreatedWorkspace, IWorkspaceActions } from '@core/ports/IWorkspaceActions';

import { request } from './httpClient';
import { tokenStore } from './tokenStore';

interface WorkspaceResponse {
  token: string;
  user: { id: string; name: string; email: string; role: string; workspaceId: string };
  workspace: {
    id: string;
    name: string;
    type: string;
    ownerId: string;
    memberIds: string[];
    inviteCode?: string;
  };
}

export class HttpWorkspaceActions implements IWorkspaceActions {
  async create(type: WorkspaceType): Promise<CreatedWorkspace> {
    const res = await request<WorkspaceResponse>('/workspaces', { method: 'POST', body: { type } });
    return this.commit(res);
  }

  async join(inviteCode: string): Promise<CreatedWorkspace> {
    const res = await request<WorkspaceResponse>('/workspaces/join', {
      method: 'POST',
      body: { inviteCode },
    });
    return this.commit(res);
  }

  /** Guarda el token nuevo y traduce la respuesta a entidades. Compartido por create y join. */
  private async commit(res: WorkspaceResponse): Promise<CreatedWorkspace> {
    await tokenStore.save(res.token);
    return {
      workspace: new Workspace({
        id: res.workspace.id,
        name: res.workspace.name,
        type: res.workspace.type as WorkspaceType,
        ownerId: res.workspace.ownerId,
        memberIds: res.workspace.memberIds,
        inviteCode: res.workspace.inviteCode,
      }),
      user: new User({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role as UserRole,
        workspaceId: res.user.workspaceId,
      }),
    };
  }
}
