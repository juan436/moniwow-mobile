/**
 * useJars — Hook
 *
 * @what     Provee datos de presentación de jarras. Mock hasta conectar backend.
 * @receives Ninguno.
 * @processes Retorna la lista de jarras. Dueño real de los datos de jarras — dashboard/ ya no los inventa.
 * @returns  { jars, isLoading, error }
 */
import { colors } from '@shared/styles';
import type { JarDisplay } from '../types';

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

export function useJars() {
  return {
    jars: MOCK_JARS,
    isLoading: false,
    error: null as string | null,
  };
}
