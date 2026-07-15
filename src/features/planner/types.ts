/**
 * planner/types — Types
 *
 * @what     Tipos display para la feature Planner (capa presentación, no dominio).
 */
import type { MaterialIcons } from '@expo/vector-icons';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

export type AgendaTab = 'mi-mes' | 'listas' | 'recurrentes';
export type AgendaFilter = 'gastos' | 'ingresos' | 'deudas';

/** El ícono se DERIVA de la jarra dueña — no se guarda aparte (mata el sistema doble emoji/iconName). */
export type AgendaItemDisplay = {
  id: string;
  iconName: MaterialIconName;
  iconColor: string;
  iconBg: string;
  name: string;
  /** Jarra de la que sale (o a la que entra) el dinero. La confirmación lo dice antes de escribir. */
  jarName: string;
  day: number;
  amount: number;
  isPaid: boolean;
  /**
   * Pasó su fecha y sigue sin confirmar. Aplica a los tres tipos, pero NO significa lo mismo:
   * en gastos/deudas es "vas tarde" (naranja de alerta); en ingresos es "¿ya llegó? márcalo"
   * (verde). El color lo decide el `filter`, no este flag.
   */
  isOverdue: boolean;
  filter: AgendaFilter;
  /** Solo en deudas: la cuota pertenece a esta deuda (C2 — una cuota es un compromiso de su deuda). */
  debtId?: string;
  /** Solo en deudas: QUÉ cuota es ('YYYY-MM'). Su identidad — pagar la de julio no paga la de agosto. */
  cuotaMonth?: string;
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

/** `pending` = lo que te queda (baja al confirmar). `paid` = lo ya hecho. Derivados de los ítems. */
export type FilterTotals = {
  pending: number;
  paid: number;
  count: number;
  paidCount: number;
};

export type AgendaData = {
  items: AgendaItemDisplay[];
  totals: Record<AgendaFilter, FilterTotals>;
};
