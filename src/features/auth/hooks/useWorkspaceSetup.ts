/**
 * useWorkspaceSetup — Hook
 *
 * @what     Orquesta la selección y creación/unión del workspace en el primer uso.
 * @receives Ningún parámetro.
 * @processes `selected: 'individual' | 'hogar'` llama a `POST /workspaces` (crea, siembra las 4
 *            jarras base y devuelve token nuevo). `selected: 'join'` llama a `POST /workspaces/join`
 *            con el código escrito en `inviteCode` (une a un hogar existente, también token nuevo).
 *            Ambos casos los resuelve `workspaceActions`, que guarda el token — el hook solo decide
 *            cuál de los dos llamar y valida el código antes de mandarlo.
 * @returns  { selected, inviteCode, isLoading, error, handleSelect, handleChangeCode, handleConfirm }
 * @props    —
 */
import { useState, useCallback } from 'react';

import type { WorkspaceType } from '@core/entities/Workspace';
import { workspaceActions } from '@infrastructure/container';

type Selection = WorkspaceType | 'join';

type WorkspaceSetupState = {
  selected: Selection | null;
  inviteCode: string;
  isLoading: boolean;
  error: string | null;
};

export function useWorkspaceSetup() {
  const [state, setState] = useState<WorkspaceSetupState>({
    selected: null,
    inviteCode: '',
    isLoading: false,
    error: null,
  });

  const handleSelect = useCallback((id: Selection) => {
    setState((prev) => ({ ...prev, selected: id, error: null }));
  }, []);

  const handleChangeCode = useCallback((inviteCode: string) => {
    setState((prev) => ({ ...prev, inviteCode, error: null }));
  }, []);

  const handleConfirm = useCallback(async (): Promise<boolean> => {
    if (!state.selected) {
      setState((prev) => ({ ...prev, error: 'Selecciona un modo para continuar' }));
      return false;
    }
    if (state.selected === 'join' && !state.inviteCode.trim()) {
      setState((prev) => ({ ...prev, error: 'Escribe el código que te compartieron' }));
      return false;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      if (state.selected === 'join') {
        await workspaceActions.join(state.inviteCode.trim());
      } else {
        await workspaceActions.create(state.selected);
      }
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al continuar';
      setState((prev) => ({ ...prev, error: message, isLoading: false }));
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.selected, state.inviteCode]);

  return {
    selected: state.selected,
    inviteCode: state.inviteCode,
    isLoading: state.isLoading,
    error: state.error,
    handleSelect,
    handleChangeCode,
    handleConfirm,
  };
}
