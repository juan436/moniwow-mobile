/**
 * AuthProvider — Context
 *
 * @what     Sesión del usuario, compartida por toda la app y persistida entre arranques.
 * @receives children
 * @processes Al montar, **restaura el token del llavero y le pregunta a la API quién es**
 *           (`/auth/me`). No alcanza con leer el token guardado: puede haber caducado, o el
 *           `workspaceId` que lleva dentro puede estar desactualizado. La API es la fuente.
 *           Mientras esa consulta corre, `isLoading` es true — sin eso la app parpadea al login
 *           aunque haya sesión válida.
 * @returns  { user, isAuthenticated, isLoading, signIn, signOut }
 *
 * Reemplaza al `useAuth` anterior, que era un `useState` suelto: cada pantalla tenía su copia y la
 * sesión moría al recargar.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import type { User } from '@core/entities/User';
import { authRepository } from '@infrastructure/container';
import { tokenStore } from '@infrastructure/http/tokenStore';

interface AuthValue {
  user: User | null;
  isAuthenticated: boolean;
  /** true mientras se comprueba la sesión guardada. Ni autenticado ni no: todavía no se sabe. */
  isLoading: boolean;
  signIn: (user: User) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const token = await tokenStore.restore();
        if (token) {
          const me = await authRepository.me();
          if (!cancelled) setUser(me);
        }
      } catch {
        // Token caducado, o API inalcanzable. En ambos casos: no hay sesión utilizable.
        await tokenStore.clear();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback((authenticated: User) => setUser(authenticated), []);

  const signOut = useCallback(async () => {
    await authRepository.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ user, isAuthenticated: user !== null, isLoading, signIn, signOut }),
    [user, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  // Falla ruidosamente: un `useAuth` fuera del provider devolvería "no hay sesión" y mandaría al
  // login sin motivo — un bug mudo y muy difícil de rastrear.
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
