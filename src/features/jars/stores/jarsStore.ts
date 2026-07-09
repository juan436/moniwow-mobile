/**
 * jarsStore — Zustand store
 *
 * @what     Fuente ÚNICA del estado de jarras (dashboard + grid + modales comparten esta lista).
 *           Reemplaza el `useState` local de useJars (antes cada pantalla tenía su copia). Mock-stage.
 * @processes Guarda estado + acciones. NO reimplementa reglas de negocio: importa `jarCapabilities`
 *           del dominio (core) y lo aplica como candado — `remove` rechaza jarras protegidas y `save`
 *           ignora campos que la jarra no permite editar (rename/budget/blindado). La UI ya deshabilita
 *           esos controles; este candado es la segunda capa (varias entradas, UI falible, futuro backend).
 * @returns  useJarsStore hook (selectores) — envuelto por useJars para mantener los call sites.
 */
import { create } from 'zustand';

import { colors } from '@shared/styles';
import { jarCapabilities } from '@core/entities/Jar';
import type { JarDisplay, CreateJarData, SaveJarData } from '../types';

const INITIAL_JARS: JarDisplay[] = [
  { id: 'libre', type: 'libre', name: 'Libre', balance: 1285.50, iconName: 'account-balance-wallet', iconBg: colors.primary + '1A', iconColor: colors.primary },
  { id: 'hogar', type: 'hogar', name: 'Hogar', balance: 1200.00, iconName: 'home', iconBg: colors.inversePrimary + '33', iconColor: colors.primary, progress: 80, targetAmount: 1500 },
  { id: 'fondo_seguridad', type: 'fondo_seguridad', name: 'Fondo Seguridad', balance: 5000.00, iconName: 'security', iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess, isBlindado: true },
  { id: 'goals', type: 'goals', name: 'Metas', balance: 3000.00, iconName: 'savings', iconBg: colors.goldDreams + '1A', iconColor: colors.goldDreams, isBlindado: true },
  { id: 'viaje', type: 'custom', name: 'Viaje Europa', balance: 500.00, iconName: 'flight', iconBg: colors.tertiaryContainer + '33', iconColor: colors.tertiary, progress: 35, targetAmount: 1500 },
  { id: 'salud', type: 'custom', name: 'Salud & Médico', balance: 750.00, iconName: 'favorite', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange, progress: 50, targetAmount: 1500 },
  { id: 'educacion', type: 'custom', name: 'Educación', balance: 200.00, iconName: 'school', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary, progress: 20, targetAmount: 1000 },
  { id: 'ocio', type: 'custom', name: 'Ocio & Diversión', balance: 320.00, iconName: 'sports-esports', iconBg: colors.inversePrimary + '1A', iconColor: colors.primary, progress: 60, targetAmount: 550 },
  { id: 'super', type: 'custom', name: 'Supermercado', balance: 1200.00, iconName: 'shopping-cart', iconBg: colors.inversePrimary + '33', iconColor: colors.primary, progress: 80, targetAmount: 1500 },
  { id: 'ropa', type: 'custom', name: 'Ropa', balance: 500.00, iconName: 'shopping-bag', iconBg: colors.tertiaryContainer + '33', iconColor: colors.tertiary, progress: 40, targetAmount: 1250 },
  { id: 'transport', type: 'custom', name: 'Transporte', balance: 200.00, iconName: 'directions-bus', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary, progress: 30, targetAmount: 650 },
  { id: 'comida', type: 'custom', name: 'Comida', balance: 300.00, iconName: 'restaurant', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange, progress: 50, targetAmount: 600 },
  { id: 'casa', type: 'custom', name: 'Casa', balance: 400.00, iconName: 'home', iconBg: colors.inversePrimary + '33', iconColor: colors.primary, progress: 60, targetAmount: 650 },
  { id: 'auto', type: 'custom', name: 'Auto', balance: 500.00, iconName: 'directions-car', iconBg: colors.tertiaryContainer + '33', iconColor: colors.tertiary, progress: 70, targetAmount: 700 },
  { id: 'mascotas', type: 'custom', name: 'Mascotas', balance: 200.00, iconName: 'pets', iconBg: colors.secondaryContainer + '4D', iconColor: colors.secondary, progress: 40, targetAmount: 500 },
  { id: 'servicios', type: 'custom', name: 'Servicios', balance: 300.00, iconName: 'build', iconBg: colors.alertOrange + '1A', iconColor: colors.alertOrange, progress: 50, targetAmount: 600 },
];

function buildCustomJar(data: CreateJarData): JarDisplay {
  return {
    id: `custom-${Date.now()}`, type: 'custom', name: data.name, iconName: data.iconName, balance: 0,
    iconBg: colors.emeraldTint, iconColor: colors.emeraldSuccess, isBlindado: data.isBlindado,
    ...(data.targetAmount !== undefined ? { targetAmount: data.targetAmount, progress: 0 } : {}),
  };
}

/** Candado de dominio: solo escribe los campos que las capacidades de la jarra permiten. */
function applySave(jar: JarDisplay, data: SaveJarData): JarDisplay {
  const caps = jarCapabilities(jar.type);
  const targetAmount = caps.canEditBudget ? data.targetAmount : jar.targetAmount;
  return {
    ...jar,
    name: caps.canRename ? data.name : jar.name,
    iconName: data.iconName,
    isBlindado: caps.canToggleBlindado ? data.isBlindado : jar.isBlindado,
    targetAmount,
    progress: targetAmount !== undefined ? (jar.progress ?? 0) : undefined,
  };
}

type JarsState = {
  jars: JarDisplay[];
  create: (data: CreateJarData) => void;
  save: (data: SaveJarData) => void;
  remove: (id: string) => void;
  transfer: (fromId: string, toId: string, amount: number) => void;
};

export const useJarsStore = create<JarsState>((set) => ({
  jars: INITIAL_JARS,
  create: (data) => set((s) => ({ jars: [...s.jars, buildCustomJar(data)] })),
  save: (data) => set((s) => ({ jars: s.jars.map((j) => (j.id === data.id ? applySave(j, data) : j)) })),
  remove: (id) => set((s) => {
    const jar = s.jars.find((j) => j.id === id);
    if (!jar || !jarCapabilities(jar.type).canDelete) return s; // jarra protegida → no-op
    return { jars: s.jars.filter((j) => j.id !== id) };
  }),
  transfer: (fromId, toId, amount) => set((s) => ({
    jars: s.jars.map((j) => {
      if (j.id === fromId) return { ...j, balance: j.balance - amount };
      if (j.id === toId) return { ...j, balance: j.balance + amount };
      return j;
    }),
  })),
}));
