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
 */
export interface IWorkspaceActions {
  create(type: WorkspaceType): Promise<CreatedWorkspace>;
}
