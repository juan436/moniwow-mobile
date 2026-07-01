/**
 * app/index.tsx — Route wrapper
 *
 * @what     Punto de entrada raíz. Delega completamente a WorkspaceSetupScreen.
 * @receives Ninguna prop (expo-router route).
 * @processes Ninguna — solo re-exporta el componente de features/auth.
 * @returns  WorkspaceSetupScreen
 */
export { WorkspaceSetupScreen as default } from '@features/auth/components/workspace-setup/WorkspaceSetupScreen';
