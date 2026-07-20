/**
 * useWorkspaceSetup — Hook
 *
 * @what     Orquesta la selección y creación del workspace en el primer uso.
 * @receives Ningún parámetro.
 * @processes Llama a `POST /workspaces`, **que es quien crea el espacio de verdad**: le pone nombre
 *            según el modo, siembra las 4 jarras base y devuelve un token nuevo (el adapter lo
 *            guarda). Antes esto llamaba al use-case local `CreateWorkspace`, que fabricaba una
 *            entidad con `ownerId: 'user_local'` y **la tiraba**: elegías modo, la pantalla avanzaba
 *            y no había pasado nada. Maneja estado, loading y errores del onboarding.
 * @returns  { selected, isLoading, error, handleSelect, handleConfirm }
 * @props    —
 */
import { useState, useCallback } from 'react';

import type { WorkspaceType } from '@core/entities/Workspace';
import { workspaceActions } from '@infrastructure/container';

type WorkspaceSetupState = {
  selected: WorkspaceType | null;
  isLoading: boolean;
  error: string | null;
};

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
      await workspaceActions.create(state.selected);
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
