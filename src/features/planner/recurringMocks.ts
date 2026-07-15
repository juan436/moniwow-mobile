/**
 * recurringMocks — Planner Feature (TEMPORAL)
 *
 * @what     Compromisos recurrentes: aún en estado local, no en la BD. Los `pendingItems` ya traen
 *           `isRecurring`/`recurrenceDayOfMonth`, así que esta lista debería derivarse de ahí — pero
 *           el CRUD de recurrentes (crear/editar/eliminar) todavía no escribe al repositorio.
 *           Extraído de `usePlanner` al conectarlo a la BD, para dejar el hook sin datos inventados
 *           y que el pendiente quede a la vista.
 */
import { colors } from '@shared/styles';
import type { AgendaFilter, RecurringDisplay } from './types';

export const RECURRENTE_ICON: Record<AgendaFilter, { iconName: RecurringDisplay['iconName']; iconColor: string; iconBg: string }> = {
  gastos:   { iconName: 'receipt-long', iconColor: colors.tertiary,       iconBg: colors.tertiary + '15' },
  ingresos: { iconName: 'attach-money', iconColor: colors.emeraldSuccess, iconBg: colors.emeraldSuccess + '15' },
  deudas:   { iconName: 'credit-card',  iconColor: colors.alertOrange,    iconBg: colors.alertOrange + '1A' },
};

export const INITIAL_RECURRENTES: RecurringDisplay[] = [
  { id: 'r1', iconName: 'home', iconColor: colors.emeraldSuccess, iconBg: colors.emeraldSuccess + '15', name: 'Alquiler Hogar', day: 5, amount: 800, filter: 'gastos' },
  { id: 'r2', iconName: 'tv', iconColor: colors.alertOrange, iconBg: colors.alertOrange + '1A', name: 'Netflix', day: 20, amount: 15, filter: 'gastos' },
  { id: 'r3', iconName: 'restaurant', iconColor: colors.secondary, iconBg: colors.secondaryContainer + '40', name: 'Suscripción Comida', day: 25, amount: 50, filter: 'gastos' },
  { id: 'r4', iconName: 'work', iconColor: colors.emeraldSuccess, iconBg: colors.emeraldSuccess + '15', name: 'Sueldo Empresa X', day: 1, amount: 2000, filter: 'ingresos' },
  { id: 'r5', iconName: 'laptop', iconColor: colors.primary, iconBg: colors.primary + '15', name: 'Pago Freelance', day: 10, amount: 150, filter: 'ingresos' },
  { id: 'r6', iconName: 'star', iconColor: colors.goldDreams, iconBg: colors.goldDreams + '20', name: 'Bono Proyecto', day: 15, amount: 625, filter: 'ingresos' },
  { id: 'r7', iconName: 'credit-card', iconColor: colors.alertOrange, iconBg: colors.alertOrange + '1A', name: 'Tarjeta Visa', day: 15, amount: 300, filter: 'deudas' },
  { id: 'r8', iconName: 'person', iconColor: colors.secondary, iconBg: colors.secondaryContainer + '40', name: 'Préstamo Mamá', day: 28, amount: 100, filter: 'deudas' },
];
