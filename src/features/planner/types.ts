/**
 * planner/types — Types
 *
 * @what     Tipos display para la feature Planner (capa presentación, no dominio).
 */
import type { MaterialIcons } from '@expo/vector-icons';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

export type AgendaTab = 'mi-mes' | 'listas' | 'recurrentes';
export type AgendaFilter = 'gastos' | 'ingresos' | 'deudas';

export type AgendaItemDisplay = {
  id: string;
  emoji: string;
  name: string;
  day: number;
  amount: number;
  isPaid: boolean;
  filter: AgendaFilter;
  urgencyLabel?: string;
};

export type ListItemDisplay = {
  id: string;
  name: string;
  approxAmount?: number;
  isChecked: boolean;
};

export type ListDisplay = {
  id: string;
  emoji: string;
  name: string;
  jarLabel: string;
  items: ListItemDisplay[];
};

export type RecurringDisplay = {
  id: string;
  iconName: MaterialIconName;
  iconColor: string;
  iconBg: string;
  name: string;
  day: number;
  amount: number;
  filter: AgendaFilter;
};

export type CreateRecurringData = { name: string; amount: number; day: number; filter: AgendaFilter };
export type SaveRecurringData   = CreateRecurringData & { id: string };

export type RecurringActions = {
  onCreate: (data: CreateRecurringData) => void;
  onSave: (data: SaveRecurringData) => void;
  onDelete: (id: string) => void;
};

export type RecurringFrequency = 'indefinido' | 'cuotas';
export type RecurringDateMode  = 'recurrente' | 'personalizada';
export type RecurringJar       = 'hogar' | 'goals' | 'libre' | 'transporte' | 'salud' | 'educacion' | 'viajes' | 'emergencias' | 'ocio';

export type RecurringForm = {
  tipo:          AgendaFilter;
  nombre:        string;
  monto:         string;
  dia:           number;
  mes:           number;
  frecuencia:    RecurringFrequency;
  modoFecha:     RecurringDateMode;
  diasFijos:     number[];
  diasPorMes:    Record<number, number[]>;
  cuotasTotales: number;
  cuotasPagadas: number;
  jarra:         RecurringJar;
};

export type AgendaData = {
  totalGastos: number;
  totalIngresos: number;
  totalDeudas: number;
  items: AgendaItemDisplay[];
};
