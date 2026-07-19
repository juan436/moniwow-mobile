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
  /** Solo en recurrentes: la regla dueña de esta ocurrencia. */
  recurrenceId?: string;
  /** Solo en recurrentes: QUÉ ocurrencia es ('YYYY-MM'). Confirmar la de julio no confirma la de agosto. */
  recurrenceMonth?: string;
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
  /** Cuánto costaría comprar toda la lista. Los ítems sin precio suman 0 (`List.approxTotal()`). */
  approxTotal: number;
  /** Cuánto llevas gastado: suma de los ítems ya marcados (`List.purchasedTotal()`). Solo lectura. */
  purchasedTotal: number;
};

export type RecurringDisplay = {
  id: string;
  iconName: MaterialIconName;
  iconColor: string;
  iconBg: string;
  name: string;
  day: number;
  /** El monto MENSUAL (la cuota, en deudas). El total de una deuda = amount × cuotas. */
  amount: number;
  filter: AgendaFilter;
  /** Necesarios para editar sin perder datos: la jarra de pago y la duración. Derivados de la entidad. */
  jarra: RecurringJar;
  frecuencia: RecurringFrequency;
  cuotas: number;
  /**
   * Pagos suyos que hay en el LIBRO. Decide si al eliminar se cancela (hay historia que cuidar) o
   * se borra de verdad (no significó nada). El modal lo dice antes de escribir.
   */
  paymentCount: number;
  /**
   * Ya terminó: su último mes quedó atrás (`endMonth` en la regla, `cancelledAt` en la deuda). No
   * es "tiene fin" — una regla con duración 12 meses tiene `endMonth` y sigue viva. Lo que se va de
   * "Compromisos activos" es lo que terminó, no lo que tiene fecha de fin.
   * Lo que quedó vencido sin pagar no desaparece: sigue en Mi Mes / Atrasados, que es donde se paga.
   */
  isOver: boolean;
};

export type CreateRecurringData = {
  name: string;
  amount: number; // mensual: para deuda es la cuota (total = amount × cuotas)
  day: number;
  filter: AgendaFilter;
  jarra: RecurringJar;
  frecuencia: RecurringFrequency;
  cuotas: number; // duración en meses (ingreso/gasto finito) o nº de cuotas (deuda a plazos)
  /** Solo deuda: el total se paga de una vez, en `day`. Con esto, `cuotas` no aplica. */
  unicoPago: boolean;
  /** Solo deuda a plazos: cuántas venían pagadas ANTES de registrarla acá. Historia previa. */
  cuotasPagadas: number;
};
export type SaveRecurringData   = CreateRecurringData & { id: string };

export type RecurringActions = {
  onCreate: (data: CreateRecurringData) => void;
  onSave: (data: SaveRecurringData) => void;
  onDelete: (id: string) => void;
};

export type RecurringFrequency = 'indefinido' | 'cuotas';
export type RecurringJar       = 'hogar' | 'goals' | 'libre' | 'transporte' | 'salud' | 'educacion' | 'viajes' | 'emergencias' | 'ocio';

export type RecurringForm = {
  tipo:          AgendaFilter;
  nombre:        string;
  monto:         string;
  /** Un solo día para los tres tipos. El 31 vale como "el último" — lo resuelve la entidad. */
  dia:           number;
  frecuencia:    RecurringFrequency;
  /** Solo deuda. `true` por defecto: el caso corriente es deberle algo a alguien y pagarlo de una. */
  unicoPago:     boolean;
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
