/**
 * useAuth — Hook
 *
 * @what     Sesión del usuario autenticado.
 * @receives Ningún parámetro.
 * @processes Reexporta el hook del contexto. La implementación vive en `AuthProvider` porque el
 *           estado es COMPARTIDO: antes esto era un `useState` local y cada pantalla tenía su
 *           propia copia de la sesión, que además se perdía al recargar.
 * @returns  { user, isAuthenticated, isLoading, signIn, signOut }
 */
export { useAuth } from '@shared/context/AuthProvider';
