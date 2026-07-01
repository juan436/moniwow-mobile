/**
 * useWorkspaceSetup — Hook
 *
 * @what     Orquesta la selección y creación del workspace en el primer uso.
 * @receives Ningún parámetro.
 * @processes Delega la creación al UseCase CreateWorkspace. Maneja estado,
 *            loading y errores del flujo de onboarding.
 * @returns  { selected, isLoading, error, handleSelect, handleConfirm }
 * @props    —
 */
import { useState, useCallback } from 'react';

import type { WorkspaceType } from '@core/entities/Workspace';
import { CreateWorkspace } from '@core/use-cases/CreateWorkspace';

type WorkspaceSetupState = {
  selected: WorkspaceType | null;
  isLoading: boolean;
  error: string | null;
};

const createWorkspace = new CreateWorkspace();

export function useWorkspaceSetup() {
  const [state, setState] = useState<WorkspaceSetupState>({
    selected: null,
    isLoading: false,
    error: null,
  });

  const handleSelect = useCallback((type: WorkspaceType) => {
    setState((prev) => ({ ...prev, selected: type, error: null }));
  }, []);

  const handleConfirm = useCallback(async (): Promise<boolean> => {
    if (!state.selected) {
      setState((prev) => ({ ...prev, error: 'Selecciona un modo para continuar' }));
      return false;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      createWorkspace.execute({ ownerId: 'user_local', type: state.selected });
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al crear el espacio';
      setState((prev) => ({ ...prev, error: message, isLoading: false }));
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.selected]);

  return {
    selected: state.selected,
    isLoading: state.isLoading,
    error: state.error,
    handleSelect,
    handleConfirm,
  };
}
