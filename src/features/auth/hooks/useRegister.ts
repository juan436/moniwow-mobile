/**
 * useRegister — Hook
 *
 * @what     Orquesta el flujo de registro de nuevo usuario.
 * @receives Ningún parámetro.
 * @processes Delega validación a RegisterUser. Llama a authService. Maneja estado, loading y error.
 * @returns  { name, email, password, confirmPassword, isLoading, error, handle* }
 */
import { useState, useCallback } from 'react';
import type { User } from '@core/entities/User';
import { RegisterUser } from '@core/use-cases/RegisterUser';
import { authService } from '@features/auth/services/authService';

type RegisterState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string | null;
};

const registerUser = new RegisterUser();

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
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      registerUser.execute({
        name: state.name,
        email: state.email,
        password: state.password,
        confirmPassword: state.confirmPassword,
      });
      const user = await authService.register(state.name, state.email, state.password);
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
