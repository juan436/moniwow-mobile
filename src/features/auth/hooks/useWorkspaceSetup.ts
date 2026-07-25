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
 *            **`handleConfirm` devuelve el `inviteCode` del hogar recién creado (FB-017):** antes se
 *            descartaba — el servidor lo genera y lo guarda, pero ningún lado de la app lo mostraba,
 *            así que el dueño de un hogar no tenía forma de conseguirlo para invitar a su familia.
 *            `join`/`individual` no devuelven código (no aplica: ya lo tenían, o no existe).
 *            **`signIn(user)` de nuevo tras crear/unirse (FB-019):** el usuario ya estaba logueado
 *            desde `RegisterScreen` (con `workspaceId: ''`) — crear o unirse cambia el token Y el
 *            workspace real, pero nadie actualizaba el `user` del contexto con esos datos frescos.
 *            Sin esto, `AuthProvider.user` quedaba pisado con el viejo hasta reiniciar la app.
 * @returns  { selected, inviteCode, isLoading, error, handleSelect, handleChangeCode, handleConfirm }
 * @props    —
 */
import { useState, useCallback } from 'react';

import type { WorkspaceType } from '@core/entities/Workspace';
import { workspaceActions } from '@infrastructure/container';
import { useAuth } from '@shared/hooks/useAuth';

type Selection = WorkspaceType | 'join';
type ConfirmResult = { success: boolean; inviteCode: string | null };

type WorkspaceSetupState = {
  selected: Selection | null;
  inviteCode: string;
  isLoading: boolean;
  error: string | null;
};

export function useWorkspaceSetup() {
  const { signIn } = useAuth();
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

  const handleConfirm = useCallback(async (): Promise<ConfirmResult> => {
    if (!state.selected) {
      setState((prev) => ({ ...prev, error: 'Selecciona un modo para continuar' }));
      return { success: false, inviteCode: null };
    }
    if (state.selected === 'join' && !state.inviteCode.trim()) {
      setState((prev) => ({ ...prev, error: 'Escribe el código que te compartieron' }));
      return { success: false, inviteCode: null };
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      if (state.selected === 'join') {
        const { user } = await workspaceActions.join(state.inviteCode.trim());
        signIn(user);
        return { success: true, inviteCode: null };
      }
      const { workspace, user } = await workspaceActions.create(state.selected);
      signIn(user);
      return { success: true, inviteCode: workspace.inviteCode ?? null };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al continuar';
      setState((prev) => ({ ...prev, error: message, isLoading: false }));
      return { success: false, inviteCode: null };
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.selected, state.inviteCode, signIn]);

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
