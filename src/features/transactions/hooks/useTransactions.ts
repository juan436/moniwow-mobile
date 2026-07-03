/**
 * useTransactions — Hook
 *
 * @what     Provee el historial de movimientos. Mock hasta conectar backend.
 * @receives Ninguno.
 * @processes Retorna transacciones con jarId — dueño real de los datos, dashboard/ y jars/
 *           consumen desde acá (ver excepciones ADR en clean_architecture.md).
 * @returns  { transactions, isLoading, error }
 */
import { colors } from '@shared/styles';
import type { TransactionDisplay, TransactionItem } from '../types';

const MOCK_TRANSACTIONS: TransactionDisplay[] = [
  { id: 'tx1', jarId: 'libre', description: 'Café Starbucks Gran Vía', amount: 4.50, isIncome: false, categoryLabel: 'Hormiga 🐜', time: 'Hace 2h', iconName: 'local-cafe', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary },
  { id: 'tx2', jarId: 'hogar', description: 'Compra Supermercado la pollera ranch', amount: 80.00, isIncome: false, categoryLabel: 'Hogar 🏠', time: 'Ayer 14:30', iconName: 'shopping-cart', iconBg: colors.inversePrimary + '33', iconColor: colors.primary, items: [
    { description: 'Leche entera 2L x2', amount: 3.80 },
    { description: 'Pan integral artesanal', amount: 2.50 },
    { description: 'Pechuga de pollo 1kg', amount: 7.20 },
    { description: 'Arroz largo fino 1kg', amount: 1.90 },
    { description: 'Aceite de oliva 500ml', amount: 6.40 },
    { description: 'Yogur griego x4', amount: 4.10 },
    { description: 'Detergente líquido 1L', amount: 3.60 },
    { description: 'Papel higiénico x12', amount: 5.80 },
  ] satisfies TransactionItem[], receiptUri: 'https://pbs.twimg.com/media/DlEPtEPWwAA6mpB?format=jpg&name=small' },
  { id: 'tx3', jarId: 'libre', description: 'Pago Freelance Diseño Web', amount: 350.00, isIncome: true, categoryLabel: 'Libre 💸', time: '24 May 09:00', iconName: 'payments', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess },
  { id: 'tx4', jarId: 'ocio', description: 'Netflix Premium Familiar', amount: 15.99, isIncome: false, categoryLabel: 'Ocio & Diversión 🎮', time: '23 May 00:01', iconName: 'play-circle', iconBg: colors.inversePrimary + '1A', iconColor: colors.primary },
  { id: 'tx5', jarId: 'salud', description: 'Farmacia Cruz Verde', amount: 32.50, isIncome: false, categoryLabel: 'Salud & Médico 💊', time: '22 May 11:15', iconName: 'local-pharmacy', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange },
  { id: 'tx6', jarId: 'hogar', description: 'Gasolina Estación Shell', amount: 60.00, isIncome: false, categoryLabel: 'Hogar 🏠', time: '21 May 08:45', iconName: 'local-gas-station', iconBg: colors.inversePrimary + '33', iconColor: colors.primary },
  { id: 'tx7', jarId: 'libre', description: 'Sueldo Empresa Tecnológica S.A.', amount: 2000.00, isIncome: true, categoryLabel: 'Libre 💸', time: '01 May 07:00', iconName: 'account-balance', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess },
  { id: 'tx8', jarId: 'libre', description: 'Uber Eats Thai Express', amount: 24.00, isIncome: false, categoryLabel: 'Hormiga 🐜', time: '30 Abr 20:15', iconName: 'fastfood', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange },
  { id: 'tx9', jarId: 'ocio', description: 'Spotify Premium', amount: 9.99, isIncome: false, categoryLabel: 'Ocio & Diversión 🎮', time: '29 Abr 00:01', iconName: 'headset', iconBg: colors.inversePrimary + '1A', iconColor: colors.primary },
  { id: 'tx10', jarId: 'libre', description: 'Transferencia de Juan García', amount: 150.00, isIncome: true, categoryLabel: 'Libre 💸', time: '28 Abr 11:00', iconName: 'swap-horiz', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess },
  { id: 'tx11', jarId: 'salud', description: 'Membresía Gimnasio Smart Fit', amount: 55.00, isIncome: false, categoryLabel: 'Salud & Médico 💊', time: '27 Abr 09:30', iconName: 'fitness-center', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange },
  { id: 'tx12', jarId: 'ocio', description: 'Amazon Prime Anual', amount: 49.99, isIncome: false, categoryLabel: 'Ocio & Diversión 🎮', time: '26 Abr 00:01', iconName: 'play-circle', iconBg: colors.inversePrimary + '1A', iconColor: colors.primary },
  { id: 'tx13', jarId: 'hogar', description: 'Renta Departamento Abril', amount: 800.00, isIncome: false, categoryLabel: 'Hogar 🏠', time: '25 Abr 08:00', iconName: 'home', iconBg: colors.inversePrimary + '33', iconColor: colors.primary },
  { id: 'tx14', jarId: 'libre', description: 'Pago Freelance App Móvil', amount: 500.00, isIncome: true, categoryLabel: 'Libre 💸', time: '24 Abr 10:00', iconName: 'payments', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess },
  { id: 'tx15', jarId: 'hogar', description: 'Electricidad CFE Bimestral', amount: 45.00, isIncome: false, categoryLabel: 'Hogar 🏠', time: '23 Abr 07:00', iconName: 'lightbulb', iconBg: colors.inversePrimary + '33', iconColor: colors.primary },
  { id: 'tx16', jarId: 'salud', description: 'Medicamentos Farmacia', amount: 18.50, isIncome: false, categoryLabel: 'Salud & Médico 💊', time: '22 Abr 16:45', iconName: 'local-pharmacy', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange },
  { id: 'tx17', jarId: 'libre', description: 'Corte de cabello barbería', amount: 12.00, isIncome: false, categoryLabel: 'Hormiga 🐜', time: '20 Abr 12:00', iconName: 'content-cut', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary },
  { id: 'tx18', jarId: 'fondo_seguridad', description: 'Transferencia desde Libre', amount: 500.00, isIncome: true, categoryLabel: 'Fondo Seguridad 🛡️', time: '15 May 09:00', iconName: 'swap-horiz', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess },
  { id: 'tx19', jarId: 'fondo_seguridad', description: 'Retiro por emergencia médica', amount: 200.00, isIncome: false, categoryLabel: 'Fondo Seguridad 🛡️', time: '10 May 18:20', iconName: 'security', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess, isLast: true },
];

export function useTransactions() {
  return {
    transactions: MOCK_TRANSACTIONS,
    isLoading: false,
    error: null as string | null,
  };
}
