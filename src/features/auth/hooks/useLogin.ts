/**
 * useLogin — Hook
 *
 * @what     Orquesta el flujo de inicio de sesión.
 * @receives Ningún parámetro.
 * @processes Delega validación a LoginUser. Llama a authService. Maneja estado, loading y error.
 * @returns  { email, password, isLoading, error, handleEmailChange, handlePasswordChange, handleLogin }
 */
import { useState, useCallback } from 'react';
import type { User } from '@core/entities/User';
import { LoginUser } from '@core/use-cases/LoginUser';
import { authService } from '@features/auth/services/authService';

type LoginState = {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
};

const loginUser = new LoginUser();

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
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      loginUser.execute({ email: state.email, password: state.password });
      const user = await authService.login(state.email, state.password);
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
