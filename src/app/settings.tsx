/**
 * SettingsRoute — Route (thin wrapper)
 *
 * @what     Ruta /settings — ajustes de la app. Delega en SettingsScreen (feature settings).
 * @returns  JSX — SettingsScreen.
 */
import { SettingsScreen } from '@features/settings/components/SettingsScreen';

export default function SettingsRoute() {
  return <SettingsScreen />;
}
