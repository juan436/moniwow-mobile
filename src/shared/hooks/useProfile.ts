/**
 * useProfile — Hook
 *
 * @what     Provee datos de presentación del usuario activo para el avatar/menú. Mock hasta backend.
 * @receives Ninguno.
 * @processes Deriva `name` (nombre completo) e `initials` (avatar del TopBar) desde firstName/lastName.
 *           Independiente de useAuth (stub sin persistencia) — misma etapa mock que el resto.
 * @returns  { profile }
 */
import { useMemo } from 'react';

export type ProfileData = {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  roleLabel: string;
  initials: string;
};

const MOCK_FIRST_NAME = 'Juan';
const MOCK_LAST_NAME = 'Villegas';
const MOCK_EMAIL = 'juancvillefer@gmail.com';
const MOCK_ROLE_LABEL = 'Representante · Hogar';

export function useProfile() {
  const profile = useMemo<ProfileData>(
    () => ({
      firstName: MOCK_FIRST_NAME,
      lastName: MOCK_LAST_NAME,
      name: `${MOCK_FIRST_NAME} ${MOCK_LAST_NAME}`,
      email: MOCK_EMAIL,
      roleLabel: MOCK_ROLE_LABEL,
      initials: (MOCK_FIRST_NAME.charAt(0) + MOCK_LAST_NAME.charAt(0)).toUpperCase(),
    }),
    [],
  );

  return { profile };
}
