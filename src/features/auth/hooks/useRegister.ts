/**
 * useRegister — Hook
 *
 * @what     Orquesta el flujo de registro de nuevo usuario.
 * @receives Ningún parámetro.
 * @processes Comprueba el formulario antes de gastar una llamada y delega el alta a la API.
 *           `confirmPassword` no viaja: es una comprobación de la UI, no un dato del servidor — y eso
 *           vale para toda esta función. Vivía en un use-case (`RegisterUser`) que se borró: el
 *           servidor valida de verdad, esto solo evita mandar un formulario a medias.
 * @returns  { name, email, password, confirmPassword, isLoading, error, handle* }
 */
import { useState, useCallback } from 'react';
import type { User } from '@core/entities/User';
import { authRepository } from '@infrastructure/container';

type RegisterState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string | null;
};

/** Formulario incompleto → el motivo; completo → `null`. */
function formError(s: Omit<RegisterState, 'isLoading' | 'error'>): string | null {
  if (!s.name.trim()) return 'El nombre es obligatorio';
  if (!s.email.trim() || !s.email.includes('@') || !s.email.includes('.')) return 'Email inválido';
  if (s.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  if (s.password !== s.confirmPassword) return 'Las contraseñas no coinciden';
  return null;
}

export function useRegister() {
  const [state, setState] = useState<RegisterState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isLoading: false,
    error: null,
  });

  const handleNameChange = useCallback((name: string) => {
    setState((prev) => ({ ...prev, name, error: null }));
  }, []);

  const handleEmailChange = useCallback((email: string) => {
    setState((prev) => ({ ...prev, email, error: null }));
  }, []);

  const handlePasswordChange = useCallback((password: string) => {
    setState((prev) => ({ ...prev, password, error: null }));
  }, []);

  const handleConfirmPasswordChange = useCallback((confirmPassword: string) => {
    setState((prev) => ({ ...prev, confirmPassword, error: null }));
  }, []);

  const handleRegister = useCallback(async (): Promise<User | null> => {
    const invalid = formError(state);
    if (invalid) {
      setState((prev) => ({ ...prev, error: invalid }));
      return null;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const user = await authRepository.register(state.name, state.email, state.password);
      return user;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al crear la cuenta';
      setState((prev) => ({ ...prev, error: message, isLoading: false }));
      return null;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.name, state.email, state.password, state.confirmPassword]);

  return {
    name: state.name,
    email: state.email,
    password: state.password,
    confirmPassword: state.confirmPassword,
    isLoading: state.isLoading,
    error: state.error,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleRegister,
  };
}
