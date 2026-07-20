/**
 * useLogin — Hook
 *
 * @what     Orquesta el flujo de inicio de sesión.
 * @receives Ningún parámetro.
 * @processes Comprueba el formulario antes de gastar una llamada y delega las credenciales a la API.
 *           El mensaje de error que se muestra es **el que manda el servidor** — está en español y a
 *           propósito no distingue "email no existe" de "contraseña mala".
 *           **La comprobación local no es una regla de negocio**: no decide si puedes entrar, solo
 *           evita mandar un formulario a medias. Vivía en un use-case (`LoginUser`) que se borró: el
 *           servidor es quien valida de verdad, y esto es cortesía de UI.
 * @returns  { email, password, isLoading, error, handleEmailChange, handlePasswordChange, handleLogin }
 */
import { useState, useCallback } from 'react';
import type { User } from '@core/entities/User';
import { authRepository } from '@infrastructure/container';

type LoginState = {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
};

/** Formulario incompleto → el motivo; completo → `null`. */
function formError(email: string, password: string): string | null {
  if (!email.trim()) return 'El email es obligatorio';
  if (!email.includes('@') || !email.includes('.')) return 'Email inválido';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return null;
}

export function useLogin() {
  const [state, setState] = useState<LoginState>({
    email: '',
    password: '',
    isLoading: false,
    error: null,
  });

  const handleEmailChange = useCallback((email: string) => {
    setState((prev) => ({ ...prev, email, error: null }));
  }, []);

  const handlePasswordChange = useCallback((password: string) => {
    setState((prev) => ({ ...prev, password, error: null }));
  }, []);

  const handleLogin = useCallback(async (): Promise<User | null> => {
    const invalid = formError(state.email, state.password);
    if (invalid) {
      setState((prev) => ({ ...prev, error: invalid }));
      return null;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const user = await authRepository.login(state.email, state.password);
      return user;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al iniciar sesión';
      setState((prev) => ({ ...prev, error: message, isLoading: false }));
      return null;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.email, state.password]);

  return {
    email: state.email,
    password: state.password,
    isLoading: state.isLoading,
    error: state.error,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
  };
}
