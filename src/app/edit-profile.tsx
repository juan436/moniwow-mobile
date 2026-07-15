/**
 * EditProfileRoute — Route (thin wrapper)
 *
 * @what     Ruta /edit-profile — editar perfil del usuario. Delega en EditProfileScreen (profile).
 * @returns  JSX — EditProfileScreen.
 */
import { EditProfileScreen } from '@features/profile/components/EditProfileScreen';

export default function EditProfileRoute() {
  return <EditProfileScreen />;
}
