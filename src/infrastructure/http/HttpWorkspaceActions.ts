/**
 * HttpWorkspaceActions — Adapter (HTTP)
 *
 * @what     Implementa IWorkspaceActions contra `POST /workspaces`.
 * @receives type: 'individual' | 'hogar'
 * @processes Manda solo el modo — el `ownerId` sale del token y el nombre lo decide el servidor.
 *           **Guarda el token nuevo pisando el anterior**, igual que hace el login: es parte de crear
 *           el espacio, no un paso aparte.
 * @returns  Promise<CreatedWorkspace>
 *
 * Sustituye al use-case `CreateWorkspace` de mobile, que fabricaba un `Workspace` con
 * `id: ws_${Date.now()}` y `ownerId: 'user_local'` **y no lo guardaba en ningún sitio**: el usuario
 * elegía modo, la pantalla avanzaba y no había pasado nada.
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
  workspace: { id: string; name: string; type: string; ownerId: string; memberIds: string[] };
}

export class HttpWorkspaceActions implements IWorkspaceActions {
  async create(type: WorkspaceType): Promise<CreatedWorkspace> {
    const res = await request<WorkspaceResponse>('/workspaces', { method: 'POST', body: { type } });
    await tokenStore.save(res.token);

    return {
      workspace: new Workspace({
        id: res.workspace.id,
        name: res.workspace.name,
        type: res.workspace.type as WorkspaceType,
        ownerId: res.workspace.ownerId,
        memberIds: res.workspace.memberIds,
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
