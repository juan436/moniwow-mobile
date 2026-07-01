/**
 * CreateWorkspace — UseCase
 *
 * @what     Crea un workspace nuevo (Individual o Hogar) para un usuario.
 * @receives CreateWorkspaceInput: { ownerId: string, type: WorkspaceType }
 * @processes Valida ownerId, genera id único, asigna nombre según tipo.
 * @returns  Workspace — entidad lista para persistir, sin side effects.
 */
import { Workspace, WorkspaceType } from '../entities/Workspace';

export interface CreateWorkspaceInput {
  ownerId: string;
  type: WorkspaceType;
}

export class CreateWorkspace {
  execute(input: CreateWorkspaceInput): Workspace {
    if (!input.ownerId.trim()) {
      throw new Error('El propietario del workspace es requerido');
    }

    const name = input.type === 'hogar' ? 'Mi Hogar' : 'Mi Espacio';

    return new Workspace({
      id: `ws_${Date.now()}`,
      name,
      type: input.type,
      ownerId: input.ownerId,
      memberIds: [],
    });
  }
}
