/**
 * useJars — Hook
 *
 * @what     Provee datos de presentación de jarras + CRUD local. Mock hasta conectar backend.
 * @receives Ninguno.
 * @processes Dueño real de los datos de jarras — dashboard/ ya no los inventa. handleTransfer resta
 *           de origen y suma a destino (misma regla que core/use-cases/TransferFunds.ts, sin
 *           conectar aún — mismo patrón mock-stage que useGoals/useAgenda). handleSave persiste
 *           iconName/targetAmount/isBlindado (antes solo actualizaba name/emoji — bug: editar
 *           Presupuesto/Blindado no se guardaba).
 * @returns  { jars, isLoading, error, handleCreate, handleSave, handleDelete, handleTransfer }
 */
import { useCallback, useState } from 'react';
import { colors } from '@shared/styles';
import type { JarDisplay, CreateJarData, SaveJarData } from '../types';

const INITIAL_JARS: JarDisplay[] = [
  { id: 'libre', name: 'Libre', balance: 1285.50, iconName: 'account-balance-wallet', iconBg: colors.primary + '1A', iconColor: colors.primary },
  { id: 'hogar', name: 'Hogar', balance: 1200.00, iconName: 'home', iconBg: colors.inversePrimary + '33', iconColor: colors.primary, progress: 80, targetAmount: 1500 },
  { id: 'fondo_seguridad', name: 'Fondo Seguridad', balance: 5000.00, iconName: 'security', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess, isBlindado: true },
  { id: 'goals', name: 'Metas', balance: 3000.00, iconName: 'savings', iconBg: colors.goldDreams + '1A', iconColor: colors.goldDreams, isBlindado: true },
  { id: 'viaje', name: 'Viaje Europa', balance: 500.00, iconName: 'flight', iconBg: colors.tertiaryContainer + '33', iconColor: colors.tertiary, progress: 35, targetAmount: 1500 },
  { id: 'salud', name: 'Salud & Médico', balance: 750.00, iconName: 'favorite', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange, progress: 50, targetAmount: 1500 },
  { id: 'educacion', name: 'Educación', balance: 200.00, iconName: 'school', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary, progress: 20, targetAmount: 1000 },
  { id: 'ocio', name: 'Ocio & Diversión', balance: 320.00, iconName: 'sports-esports', iconBg: colors.inversePrimary + '1A', iconColor: colors.primary, progress: 60, targetAmount: 550 },
  { id: 'super', name: 'Supermercado', balance: 1200.00, iconName: 'shopping-cart', iconBg: colors.inversePrimary + '33', iconColor: colors.primary, progress: 80, targetAmount: 1500 },
  { id: 'ropa', name: 'Ropa', balance: 500.00, iconName: 'shopping-bag', iconBg: colors.tertiaryContainer + '33', iconColor: colors.tertiary, progress: 40, targetAmount: 1250 },
  { id: 'transport', name: 'Transporte', balance: 200.00, iconName: 'directions-bus', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary, progress: 30, targetAmount: 650 },
  { id: 'comida', name: 'Comida', balance: 300.00, iconName: 'restaurant', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange, progress: 50, targetAmount: 600 },
  { id: 'casa', name: 'Casa', balance: 400.00, iconName: 'home', iconBg: colors.inversePrimary + '33', iconColor: colors.primary, progress: 60, targetAmount: 650 },
  { id: 'auto', name: 'Auto', balance: 500.00, iconName: 'directions-car', iconBg: colors.tertiaryContainer + '33', iconColor: colors.tertiary, progress: 70, targetAmount: 700 },
  { id: 'mascotas', name: 'Mascotas', balance: 200.00, iconName: 'pets', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary, progress: 40, targetAmount: 500 },
  { id: 'servicios', name: 'Servicios', balance: 300.00, iconName: 'build', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange, progress: 50, targetAmount: 600 },
];

export function useJars() {
  const [jars, setJars] = useState<JarDisplay[]>(INITIAL_JARS);

  const handleCreate = useCallback((data: CreateJarData) => {
    setJars((prev) => [...prev, {
      id: `custom-${Date.now()}`,
      name: data.name,
      iconName: data.iconName,
      balance: 0,
      iconBg: colors.emeraldTint,
      iconColor: colors.emeraldSuccess,
      isBlindado: data.isBlindado,
      ...(data.targetAmount !== undefined ? { targetAmount: data.targetAmount, progress: 0 } : {}),
    }]);
  }, []);

  const handleSave = useCallback((data: SaveJarData) => {
    setJars((prev) => prev.map((j) => j.id === data.id ? {
      ...j,
      name: data.name,
      iconName: data.iconName,
      isBlindado: data.isBlindado,
      targetAmount: data.targetAmount,
      progress: data.targetAmount !== undefined ? (j.progress ?? 0) : undefined,
    } : j));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setJars((prev) => prev.filter((j) => j.id !== id));
  }, []);

  const handleTransfer = useCallback((fromId: string, toId: string, amount: number) => {
    setJars((prev) => prev.map((j) => {
      if (j.id === fromId) return { ...j, balance: j.balance - amount };
      if (j.id === toId)   return { ...j, balance: j.balance + amount };
      return j;
    }));
  }, []);

  return {
    jars, isLoading: false, error: null as string | null,
    handleCreate, handleSave, handleDelete, handleTransfer,
  };
}
