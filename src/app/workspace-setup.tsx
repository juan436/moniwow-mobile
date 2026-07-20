/**
 * app/workspace-setup.tsx — Route wrapper
 *
 * @what     Paso 2 del registro: elegir cómo se usa MoniWow (solo yo / con mi familia).
 * @receives Ninguna prop (expo-router route).
 * @processes Ninguna — solo re-exporta el componente de features/auth. Se llega desde
 *           RegisterScreen tras crear la cuenta; no es alcanzable desde el arranque.
 * @returns  WorkspaceSetupScreen
 */
export { WorkspaceSetupScreen as default } from '@features/auth/components/workspace-setup/WorkspaceSetupScreen';
