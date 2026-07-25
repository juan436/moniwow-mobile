/**
 * useNotifications — Hook
 *
 * @what     Notificaciones derivadas de datos reales — pagos próximos y metas cerca del objetivo.
 * @receives Ninguno.
 * @processes **FB-020: sin backend de notificaciones ni colección nueva** — se deriva de
 *           `GET /summary` (compromisos próximos, mismo dato que "Próximos" del Dashboard) y
 *           `GET /goals` (progreso, mismo dato que la tab Metas). Sin "leído" persistido: no son
 *           eventos pasados, son hechos vigentes — si el pago sigue por vencer, sigue en la lista la
 *           próxima vez que se abra, y eso es correcto, no un bug. `unreadCount` = cuántas alertas
 *           hay activas ahora, no un contador de mensajes sin abrir.
 * @returns  { notifications, unreadCount }
 */
import { useCallback, useEffect, useState } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

import { colors } from '@shared/styles';
import { summaryRepository, goalRepository } from '@infrastructure/container';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado
const UPCOMING_LIMIT = 10;
const GOAL_NEAR_THRESHOLD = 75; // % de la meta a partir del cual se avisa "casi"
const MS_PER_DAY = 86_400_000;

type IconName = keyof typeof MaterialIcons.glyphMap;

export type NotificationItem = {
  id: string;
  icon: IconName;
  tint: string;
  title: string;
  body: string;
};

function daysUntil(due: Date, today: Date): number {
  const d = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate());
  const t = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((d - t) / MS_PER_DAY);
}

function dueLabel(days: number): string {
  if (days < 0) return 'atrasado';
  if (days === 0) return 'vence hoy';
  if (days === 1) return 'vence mañana';
  return `vence en ${days} días`;
}

export function useNotifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const load = useCallback(async () => {
    const today = new Date();
    const [summary, goals] = await Promise.all([
      summaryRepository.find({ upcomingLimit: UPCOMING_LIMIT }),
      goalRepository.findByWorkspace(WORKSPACE_ID),
    ]);

    const upcomingItems: NotificationItem[] = summary.upcoming
      .filter((c) => c.type === 'pago')
      .map((c) => ({
        id: `upcoming-${c.id}`,
        icon: 'event',
        tint: colors.alertOrange,
        title: 'Pago próximo',
        body: `${c.description} — ${dueLabel(daysUntil(c.dueDate, today))}, $ ${c.amount.toLocaleString('es')}.`,
      }));

    const goalItems: NotificationItem[] = goals
      .filter((g) => g.progressPercent() >= GOAL_NEAR_THRESHOLD && g.progressPercent() < 100)
      .map((g) => ({
        id: `goal-${g.id}`,
        icon: 'savings',
        tint: colors.goldDreams,
        title: '¡Meta más cerca!',
        body: `${g.name} llegó al ${Math.round(g.progressPercent())}% de su objetivo.`,
      }));

    setItems([...upcomingItems, ...goalItems]);
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { notifications: items, unreadCount: items.length };
}
