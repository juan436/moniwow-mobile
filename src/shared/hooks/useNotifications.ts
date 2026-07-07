/**
 * useNotifications — Hook
 *
 * @what     Provee lista de notificaciones de presentación + marcar leídas. Mock hasta backend.
 * @receives Ninguno.
 * @processes Dueño de los datos de notificaciones (mismo patrón mock-stage que useJars/useGoals).
 *           `unreadCount` alimenta el badge de la campanita. `markAllRead` pone todas en leído.
 * @returns  { notifications, unreadCount, markAllRead }
 */
import { useCallback, useMemo, useState } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@shared/styles';

type IconName = keyof typeof MaterialIcons.glyphMap;

export type NotificationItem = {
  id: string;
  icon: IconName;
  tint: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', icon: 'receipt-long', tint: colors.emeraldSuccess, title: 'Compra registrada', body: 'Supermercado — $ 42.300 asignado a Comida.', time: 'Hace 5 min', isRead: false },
  { id: 'n2', icon: 'savings', tint: colors.goldDreams, title: '¡Meta más cerca!', body: 'Viaje Europa llegó al 35 % de su objetivo.', time: 'Hace 2 h', isRead: false },
  { id: 'n3', icon: 'event', tint: colors.alertOrange, title: 'Pago próximo', body: 'Alquiler vence en 3 días — $ 850.000.', time: 'Ayer', isRead: false },
  { id: 'n4', icon: 'shield', tint: colors.primary, title: 'Fondo Seguridad protegido', body: 'Se bloqueó un retiro no planeado. Bien hecho.', time: 'Hace 2 días', isRead: true },
  { id: 'n5', icon: 'group', tint: colors.slateGray, title: 'Nuevo integrante', body: 'Sofía se unió a tu espacio Hogar.', time: 'Hace 4 días', isRead: true },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => (n.isRead ? n : { ...n, isRead: true })));
  }, []);

  return { notifications, unreadCount, markAllRead };
}
