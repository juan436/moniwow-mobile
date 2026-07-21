import { User } from '../entities/User';
import { Workspace, WorkspaceType } from '../entities/Workspace';

export interface CreatedWorkspace {
  workspace: Workspace;
  /** El usuario ya atado al espacio nuevo. */
  user: User;
}

/**
 * Crear un espacio es una ACCIÓN, no un `save()`: el servidor decide el nombre según el modo, siembra
 * las 4 jarras base y **devuelve un token nuevo**. El token viejo lleva `workspaceId: ''` congelado
 * dentro, así que el adapter tiene que pisarlo — si no, la base queda bien y el token miente: el
 * usuario ve cero de todo durante 30 días sin un solo error.
 *
 * **`join` es el mismo trato** (F2 multitenant): unirse a un hogar con su código cambia el
 * `workspaceId` del que entra, así que también devuelve token nuevo que hay que pisar. El servidor lo
 * mete como `integrante`, no como dueño.
 */
export interface IWorkspaceActions {
  create(type: WorkspaceType): Promise<CreatedWorkspace>;
  join(inviteCode: string): Promise<CreatedWorkspace>;
}
