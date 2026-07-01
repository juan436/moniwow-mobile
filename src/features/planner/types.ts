/**
 * agenda/types — Types
 *
 * @what     Tipos display para la feature Agenda (capa presentación, no dominio).
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

export type ListaItemDisplay = {
  id: string;
  name: string;
  approxAmount?: number;
  isChecked: boolean;
};

export type ListaDisplay = {
  id: string;
  emoji: string;
  name: string;
  jarLabel: string;
  items: ListaItemDisplay[];
};

export type RecurrenteDisplay = {
  id: string;
  iconName: MaterialIconName;
  iconColor: string;
  iconBg: string;
  name: string;
  day: number;
  amount: number;
  filter: AgendaFilter;
};

export type CompromisoFrecuencia = 'indefinido' | 'cuotas';
export type CompromisoJarra     = 'hogar' | 'ahorro' | 'libre' | 'transporte' | 'salud' | 'educacion' | 'viajes' | 'emergencias' | 'ocio';

export type NuevoCompromisoForm = {
  tipo:          AgendaFilter;
  nombre:        string;
  monto:         string;
  dia:           number;
  mes:           number;
  frecuencia:    CompromisoFrecuencia;
  cuotasTotales: number;
  cuotasPagadas: number;
  jarra:         CompromisoJarra;
};

export type AgendaData = {
  totalGastos: number;
  totalIngresos: number;
  totalDeudas: number;
  items: AgendaItemDisplay[];
  listas: ListaDisplay[];
  recurrentes: RecurrenteDisplay[];
};
