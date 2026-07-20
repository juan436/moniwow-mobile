/**
 * app/index.tsx — Route wrapper
 *
 * @what     Punto de entrada raíz. Decide a dónde va la app según la sesión guardada.
 * @receives Ninguna prop (expo-router route).
 * @processes Con sesión válida entra directo a los tabs; sin ella, a `/login`. Mientras se
 *           comprueba (`isLoading`) no redirige a ningún lado: hacerlo mandaría al login por un
 *           instante a un usuario que SÍ tiene sesión, y el parpadeo se ve.
 *           El workspace no vive acá — es el paso 2 del registro (`/workspace-setup`).
 * @returns  <Redirect /> o una pantalla vacía mientras decide.
 */
import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { useAuth } from '@shared/hooks/useAuth';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <View />;

  return <Redirect href={(isAuthenticated ? '/(tabs)' : '/login') as never} />;
}
