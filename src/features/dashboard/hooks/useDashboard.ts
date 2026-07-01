/**
 * useDashboard — Hook
 *
 * @what     Provee datos de presentación del dashboard central. Mock hasta conectar backend.
 * @receives Ninguno.
 * @processes Retorna datos estáticos para DashboardPage.
 * @returns  Datos para saldo, jarras, transacciones y próximos vencimientos.
 */
import { colors } from '@shared/styles';
import type {
  JarDisplay, TransactionDisplay, TransactionItem,
  UpcomingExpense,
} from '../types';

const MOCK_JARS: JarDisplay[] = [
  { id: 'libre', name: 'Libre', balance: 1285.50, iconName: 'account-balance-wallet', iconBg: colors.primary + '1A', iconColor: colors.primary },
  { id: 'hogar', name: 'Hogar', balance: 1200.00, iconName: 'home', iconBg: colors.inversePrimary + '33', iconColor: colors.primary, progress: 80 },
  { id: 'ahorro', name: 'Ahorro Blindado', balance: 3000.00, iconName: 'savings', iconBg: colors.goldDreams + '1A', iconColor: colors.goldDreams, isBlindado: true },
  { id: 'viaje', name: 'Viaje Europa', balance: 500.00, iconName: 'flight', iconBg: colors.tertiaryContainer + '33', iconColor: colors.tertiary, progress: 35 },
  { id: 'salud', name: 'Salud & Médico', balance: 750.00, iconName: 'favorite', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange, progress: 50 },
  { id: 'educacion', name: 'Educación', balance: 200.00, iconName: 'school', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary, progress: 20 },
  { id: 'emergencia', name: 'Fondo Emergencias', balance: 5000.00, iconName: 'security', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess, isBlindado: true },
  { id: 'ocio', name: 'Ocio & Diversión', balance: 320.00, iconName: 'sports-esports', iconBg: colors.inversePrimary + '1A', iconColor: colors.primary, progress: 60 },
  { id: 'super', name: 'Supermercado', balance: 1200.00, iconName: 'shopping-cart', iconBg: colors.inversePrimary + '33', iconColor: colors.primary, progress: 80 },
  { id: 'ropa', name: 'Ropa', balance: 500.00, iconName: 'shopping-bag', iconBg: colors.tertiaryContainer + '33', iconColor: colors.tertiary, progress: 40 },
  { id: 'transport', name: 'Transporte', balance: 200.00, iconName: 'directions-bus', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary, progress: 30 },
  { id: 'comida', name: 'Comida', balance: 300.00, iconName: 'restaurant', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange, progress: 50 },
  { id: 'casa', name: 'Casa', balance: 400.00, iconName: 'home', iconBg: colors.inversePrimary + '33', iconColor: colors.primary, progress: 60 },
  { id: 'auto', name: 'Auto', balance: 500.00, iconName: 'directions-car', iconBg: colors.tertiaryContainer + '33', iconColor: colors.tertiary, progress: 70 },
  { id: 'mascotas', name: 'Mascotas', balance: 200.00, iconName: 'pets', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary, progress: 40 },
  { id: 'servicios', name: 'Servicios', balance: 300.00, iconName: 'build', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange, progress: 50 },
];

const MOCK_TRANSACTIONS: TransactionDisplay[] = [
  { id: 'tx1', description: 'Café Starbucks Gran Vía', amount: 4.50, isIncome: false, categoryLabel: 'Hormiga 🐜', time: 'Hace 2h', iconName: 'local-cafe', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary },
  { id: 'tx2', description: 'Compra Supermercado la pollera ranch', amount: 80.00, isIncome: false, categoryLabel: 'Hogar 🏠', time: 'Ayer 14:30', iconName: 'shopping-cart', iconBg: colors.inversePrimary + '33', iconColor: colors.primary, items: [
    { description: 'Leche entera 2L x2', amount: 3.80 },
    { description: 'Pan integral artesanal', amount: 2.50 },
    { description: 'Pechuga de pollo 1kg', amount: 7.20 },
    { description: 'Arroz largo fino 1kg', amount: 1.90 },
    { description: 'Aceite de oliva 500ml', amount: 6.40 },
    { description: 'Yogur griego x4', amount: 4.10 },
    { description: 'Detergente líquido 1L', amount: 3.60 },
    { description: 'Papel higiénico x12', amount: 5.80 },
  ] satisfies TransactionItem[], receiptUri: 'https://pbs.twimg.com/media/DlEPtEPWwAA6mpB?format=jpg&name=small' },
  { id: 'tx3', description: 'Pago Freelance Diseño Web', amount: 350.00, isIncome: true, categoryLabel: 'Libre 💸', time: '24 May 09:00', iconName: 'payments', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess },
  { id: 'tx4', description: 'Netflix Premium Familiar', amount: 15.99, isIncome: false, categoryLabel: 'Ocio & Diversión 🎮', time: '23 May 00:01', iconName: 'play-circle', iconBg: colors.inversePrimary + '1A', iconColor: colors.primary },
  { id: 'tx5', description: 'Farmacia Cruz Verde', amount: 32.50, isIncome: false, categoryLabel: 'Salud & Médico 💊', time: '22 May 11:15', iconName: 'local-pharmacy', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange },
  { id: 'tx6', description: 'Gasolina Estación Shell', amount: 60.00, isIncome: false, categoryLabel: 'Hogar 🏠', time: '21 May 08:45', iconName: 'local-gas-station', iconBg: colors.inversePrimary + '33', iconColor: colors.primary },
  { id: 'tx7', description: 'Sueldo Empresa Tecnológica S.A.', amount: 2000.00, isIncome: true, categoryLabel: 'Libre 💸', time: '01 May 07:00', iconName: 'account-balance', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess },
  { id: 'tx8', description: 'Uber Eats Thai Express', amount: 24.00, isIncome: false, categoryLabel: 'Hormiga 🐜', time: '30 Abr 20:15', iconName: 'fastfood', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange },
  { id: 'tx9', description: 'Spotify Premium', amount: 9.99, isIncome: false, categoryLabel: 'Ocio & Diversión 🎮', time: '29 Abr 00:01', iconName: 'headset', iconBg: colors.inversePrimary + '1A', iconColor: colors.primary },
  { id: 'tx10', description: 'Transferencia de Juan García', amount: 150.00, isIncome: true, categoryLabel: 'Libre 💸', time: '28 Abr 11:00', iconName: 'swap-horiz', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess },
  { id: 'tx11', description: 'Membresía Gimnasio Smart Fit', amount: 55.00, isIncome: false, categoryLabel: 'Salud & Médico 💊', time: '27 Abr 09:30', iconName: 'fitness-center', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange },
  { id: 'tx12', description: 'Amazon Prime Anual', amount: 49.99, isIncome: false, categoryLabel: 'Ocio & Diversión 🎮', time: '26 Abr 00:01', iconName: 'play-circle', iconBg: colors.inversePrimary + '1A', iconColor: colors.primary },
  { id: 'tx13', description: 'Renta Departamento Abril', amount: 800.00, isIncome: false, categoryLabel: 'Hogar 🏠', time: '25 Abr 08:00', iconName: 'home', iconBg: colors.inversePrimary + '33', iconColor: colors.primary },
  { id: 'tx14', description: 'Pago Freelance App Móvil', amount: 500.00, isIncome: true, categoryLabel: 'Libre 💸', time: '24 Abr 10:00', iconName: 'payments', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess },
  { id: 'tx15', description: 'Electricidad CFE Bimestral', amount: 45.00, isIncome: false, categoryLabel: 'Hogar 🏠', time: '23 Abr 07:00', iconName: 'lightbulb', iconBg: colors.inversePrimary + '33', iconColor: colors.primary },
  { id: 'tx16', description: 'Medicamentos Farmacia', amount: 18.50, isIncome: false, categoryLabel: 'Salud & Médico 💊', time: '22 Abr 16:45', iconName: 'local-pharmacy', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange },
  { id: 'tx17', description: 'Corte de cabello barbería', amount: 12.00, isIncome: false, categoryLabel: 'Hormiga 🐜', time: '20 Abr 12:00', iconName: 'content-cut', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary, isLast: true },
];

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
    saldoLibre:   1285.50,
    jars:         MOCK_JARS,
    transactions: MOCK_TRANSACTIONS,
    upcoming:     MOCK_UPCOMING,
    isLoading: false,
    error: null as string | null,
  };
}
