/**
 * useDashboard — Hook
 *
 * @what     Provee datos de presentación del dashboard central. Mock hasta conectar backend.
 * @receives Ninguno.
 * @processes Retorna datos estáticos para DashboardPage. Jarras vive en features/jars/useJars,
 *           transacciones en features/transactions/useTransactions — dashboard/ ya no las inventa
 *           (ver ADR excepciones dashboard→jars, dashboard→transactions en clean_architecture.md).
 * @returns  Datos para saldo y próximos vencimientos.
 */
import type { UpcomingExpense } from '../types';

const MOCK_UPCOMING: UpcomingExpense[] = [
  { id: 'u1', name: 'Electricidad CFE Bimestral', urgency: 'Mañana', amount: 45.00, iconName: 'lightbulb' },
  { id: 'u2', name: 'Renta Departamento Mensual', urgency: 'En 5 días', amount: 800.00, iconName: 'home' },
  { id: 'u3', name: 'Internet Fibra Óptica Telmex', urgency: 'En 8 días', amount: 35.00, iconName: 'wifi' },
  { id: 'u4', name: 'Seguro Automóvil GNP Anual', urgency: 'En 12 días', amount: 180.00, iconName: 'directions-car' },
  { id: 'u5', name: 'Membresía Gimnasio Smart Fit', urgency: 'En 15 días', amount: 55.00, iconName: 'fitness-center' },
  { id: 'u6', name: 'Agua Potable Servicio Municipal', urgency: 'En 20 días', amount: 22.00, iconName: 'water-drop' },
];

export function useDashboard() {
  return {
    saldoLibre: 1285.50,
    upcoming:   MOCK_UPCOMING,
    isLoading: false,
    error: null as string | null,
  };
}
