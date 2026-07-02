/**
 * usePlanner — Hook
 *
 * @what     Estado y datos mock de la feature Planner + CRUD local de compromisos recurrentes.
 * @receives —
 * @processes Expone activeTab, activeFilter, data mock y setters. Mock hasta conectar backend:
 *           recurrentes vive en estado propio (no en AgendaData) para poder crear/editar/eliminar.
 * @returns  { activeTab, setActiveTab, activeFilter, setActiveFilter, data, recurrentes,
 *            recurrenteActions, isLoading, error }
 */
import { useCallback, useMemo, useState } from 'react';

import { colors } from '@shared/styles';
import type {
  AgendaTab, AgendaFilter, AgendaData, RecurringDisplay,
  CreateRecurringData, SaveRecurringData, RecurringActions,
} from '../types';

const RECURRENTE_ICON: Record<AgendaFilter, { iconName: RecurringDisplay['iconName']; iconColor: string; iconBg: string }> = {
  gastos:   { iconName: 'receipt-long', iconColor: colors.tertiary,      iconBg: colors.tertiary + '15' },
  ingresos: { iconName: 'attach-money', iconColor: colors.emeraldSuccess, iconBg: colors.emeraldSuccess + '15' },
  deudas:   { iconName: 'credit-card',  iconColor: colors.alertOrange,   iconBg: colors.alertOrange + '1A' },
};

const MOCK_DATA: AgendaData = {
  totalGastos: 1737.98,
  totalIngresos: 2787.50,
  totalDeudas: 655,
  items: [
    { id: 'g1', emoji: '🏠', name: 'Alquiler Hogar', day: 5, amount: 800, isPaid: false, filter: 'gastos' },
    { id: 'g2', emoji: '🏢', name: 'Expensas Edificio', day: 10, amount: 120, isPaid: false, filter: 'gastos' },
    { id: 'g3', emoji: '⚡', name: 'Energía Eléctrica', day: 12, amount: 45, isPaid: false, filter: 'gastos' },
    { id: 'g4', emoji: '📡', name: 'Internet Fibra', day: 15, amount: 40, isPaid: false, filter: 'gastos' },
    { id: 'g5', emoji: '📺', name: 'Netflix', day: 20, amount: 15, isPaid: false, filter: 'gastos' },
    { id: 'g6', emoji: '💧', name: 'Agua Potable', day: 5, amount: 22, isPaid: false, filter: 'gastos' },
    { id: 'g7', emoji: '🅿️', name: 'Parking Mensual', day: 5, amount: 60, isPaid: false, filter: 'gastos' },
    { id: 'g8', emoji: '🎵', name: 'Spotify', day: 15, amount: 9.99, isPaid: false, filter: 'gastos' },
    { id: 'g9', emoji: '☁️', name: 'iCloud 200GB', day: 15, amount: 2.99, isPaid: false, filter: 'gastos' },
    { id: 'g10', emoji: '🏋️', name: 'Gimnasio Smart Fit', day: 15, amount: 55, isPaid: true, filter: 'gastos' },
    { id: 'g11', emoji: '📱', name: 'Plan Móvil', day: 20, amount: 18, isPaid: false, filter: 'gastos' },
    { id: 'g12', emoji: '🛡️', name: 'Seguro Médico', day: 28, amount: 90, isPaid: false, filter: 'gastos' },
    { id: 'i1', emoji: '💼', name: 'Sueldo Empresa X', day: 1, amount: 2000, isPaid: false, filter: 'ingresos' },
    { id: 'i2', emoji: '💸', name: 'Pago Freelance', day: 10, amount: 150, isPaid: false, filter: 'ingresos' },
    { id: 'i3', emoji: '🎯', name: 'Bono Proyecto', day: 15, amount: 625.50, isPaid: false, filter: 'ingresos' },
    { id: 'i4', emoji: '🏦', name: 'Intereses Ahorro', day: 28, amount: 12.50, isPaid: false, filter: 'ingresos' },
    { id: 'd1', emoji: '💳', name: 'Tarjeta Visa', day: 15, amount: 300, isPaid: false, filter: 'deudas' },
    { id: 'd2', emoji: '🧍', name: 'Préstamo Mamá (4/10)', day: 28, amount: 100, isPaid: false, filter: 'deudas' },
    { id: 'd3', emoji: '🚗', name: 'Cuota Auto (8/36)', day: 5, amount: 180, isPaid: false, filter: 'deudas' },
    { id: 'd4', emoji: '📲', name: 'Tarjeta Débito Plus', day: 20, amount: 75, isPaid: false, filter: 'deudas' },
  ],
  listas: [
    {
      id: 'l1', emoji: '🛒', name: 'SUPERMERCADO', jarLabel: 'Hogar 🏠',
      items: [
        { id: 'li1', name: 'Leche', approxAmount: 2.50, isChecked: false },
        { id: 'li2', name: 'Huevos', approxAmount: 4.00, isChecked: false },
        { id: 'li3', name: 'Pan', approxAmount: 1.50, isChecked: true },
      ],
    },
    {
      id: 'l2', emoji: '🛠️', name: 'FERRETERÍA', jarLabel: 'Hogar 🏠',
      items: [{ id: 'li4', name: 'Bombillo Sala', isChecked: false }],
    },
    {
      id: 'l3', emoji: '👗', name: 'DESEOS', jarLabel: 'Libre 🍃',
      items: [{ id: 'li5', name: 'Zapatos Deportivos', isChecked: false }],
    },
  ],
};

const INITIAL_RECURRENTES: RecurringDisplay[] = [
  { id: 'r1', iconName: 'home', iconColor: colors.emeraldSuccess, iconBg: colors.emeraldSuccess + '15', name: 'Alquiler Hogar', day: 5, amount: 800, filter: 'gastos' },
  { id: 'r2', iconName: 'tv', iconColor: colors.alertOrange, iconBg: colors.alertOrange + '1A', name: 'Netflix', day: 20, amount: 15, filter: 'gastos' },
  { id: 'r3', iconName: 'restaurant', iconColor: colors.secondary, iconBg: colors.secondaryContainer + '40', name: 'Suscripción Comida', day: 25, amount: 50, filter: 'gastos' },
  { id: 'r4', iconName: 'work', iconColor: colors.emeraldSuccess, iconBg: colors.emeraldSuccess + '15', name: 'Sueldo Empresa X', day: 1, amount: 2000, filter: 'ingresos' },
  { id: 'r5', iconName: 'laptop', iconColor: colors.primary, iconBg: colors.primary + '15', name: 'Pago Freelance', day: 10, amount: 150, filter: 'ingresos' },
  { id: 'r6', iconName: 'star', iconColor: colors.goldDreams, iconBg: colors.goldDreams + '20', name: 'Bono Proyecto', day: 15, amount: 625, filter: 'ingresos' },
  { id: 'r7', iconName: 'credit-card', iconColor: colors.alertOrange, iconBg: colors.alertOrange + '1A', name: 'Tarjeta Visa', day: 15, amount: 300, filter: 'deudas' },
  { id: 'r8', iconName: 'person', iconColor: colors.secondary, iconBg: colors.secondaryContainer + '40', name: 'Préstamo Mamá', day: 28, amount: 100, filter: 'deudas' },
];

export function usePlanner() {
  const [activeTab, setActiveTab] = useState<AgendaTab>('mi-mes');
  const [activeFilter, setActiveFilter] = useState<AgendaFilter>('gastos');
  const [recurrentes, setRecurrentes] = useState<RecurringDisplay[]>(INITIAL_RECURRENTES);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const handleCreateRecurrente = useCallback((data: CreateRecurringData) => {
    const icon = RECURRENTE_ICON[data.filter];
    const item: RecurringDisplay = { id: `r_${Date.now()}`, ...icon, ...data };
    setRecurrentes((prev) => [...prev, item]);
  }, []);

  const handleSaveRecurrente = useCallback((data: SaveRecurringData) => {
    const icon = RECURRENTE_ICON[data.filter];
    setRecurrentes((prev) => prev.map((r) => r.id === data.id ? { ...r, ...icon, ...data } : r));
  }, []);

  const handleDeleteRecurrente = useCallback((id: string) => {
    setRecurrentes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const recurrenteActions: RecurringActions = useMemo(() => ({
    onCreate: handleCreateRecurrente,
    onSave: handleSaveRecurrente,
    onDelete: handleDeleteRecurrente,
  }), [handleCreateRecurrente, handleSaveRecurrente, handleDeleteRecurrente]);

  return {
    activeTab, setActiveTab, activeFilter, setActiveFilter,
    data: MOCK_DATA, recurrentes, recurrenteActions,
    isLoading, error,
  };
}
