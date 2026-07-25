/**
 * useProfile — Hook
 *
 * @what     Provee datos de presentación del usuario activo para el avatar/menú/Editar perfil.
 * @receives Ninguno.
 * @processes Deriva de `useAuth().user` (contexto real, FB-020) — antes eran 4 constantes
 *           hardcodeadas ("Juan Villegas") que TODO usuario logueado veía por igual, sin importar
 *           quién entrara. `name` es un solo campo (así lo guarda el backend, sin `firstName`/
 *           `lastName` inventados) — `initials` saca las primeras dos palabras.
 * @returns  { profile }
 */
import { useMemo } from 'react';

import { useAuth } from './useAuth';

export type ProfileData = {
  name: string;
  email: string;
  roleLabel: string;
  initials: string;
};

function initialsOf(name: string): string {
  const [first, second] = name.trim().split(/\s+/);
  return ((first?.charAt(0) ?? '') + (second?.charAt(0) ?? '')).toUpperCase();
}

export function useProfile() {
  const { user } = useAuth();

  const profile = useMemo<ProfileData>(() => {
    if (!user) return { name: '', email: '', roleLabel: '', initials: '' };
    return {
      name: user.name,
      email: user.email,
      roleLabel: user.role === 'representante' ? 'Representante' : 'Integrante',
      initials: initialsOf(user.name),
    };
  }, [user]);

  return { profile };
}
