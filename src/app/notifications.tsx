/**
 * NotificationsRoute — Route (thin wrapper)
 *
 * @what     Ruta /notifications — bandeja de notificaciones. Delega en NotificationsScreen (settings).
 * @returns  JSX — NotificationsScreen.
 */
import { NotificationsScreen } from '@features/settings/components/NotificationsScreen';

export default function NotificationsRoute() {
  return <NotificationsScreen />;
}
