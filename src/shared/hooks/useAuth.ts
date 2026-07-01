/**
 * useAuth — Hook
 *
 * @what     Estado global de sesión del usuario autenticado.
 * @receives Ningún parámetro.
 * @processes Expone usuario activo, signIn y signOut.
 *            Stub para fase demo — requiere React Context para persistencia real.
 * @returns  { user, isAuthenticated, signIn, signOut }
 */
import { useState, useCallback } from 'react';
import type { User } from '@core/entities/User';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback((authenticatedUser: User) => {
    setUser(authenticatedUser);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    signIn,
    signOut,
  };
}
