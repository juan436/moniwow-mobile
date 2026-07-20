/**
 * DebtStatus — Types de dominio
 *
 * @what     El estado real de una deuda: qué cuotas se pagaron, cuáles se deben y cuáles van
 *           atrasadas.
 * @receives —
 * @processes Nada. Son la forma de lo que `GET /debts` devuelve.
 * @returns  —
 *
 * Esto lo calculaba `ComputeDebtStatus` en mobile cruzando la deuda con el libro. **Ahora lo hace el
 * servidor** (`FindDebtsByWorkspace`) y acá solo queda el tipo — ver [[planes/estructura-front-backend]].
 * Que el front tuviera la regla obligaba a bajarse el libro entero solo para saber si debías una cuota.
 */
import type { Debt } from '../entities/Debt';

export interface CuotaStatus {
  /** Mes que cubre la cuota, 'YYYY-MM'. Es su identidad: la cuota de julio es la de julio. */
  month: string;
  number: number;
  dueDate: Date;
  amount: number;
  isPaid: boolean;
}

export interface DebtStatus {
  paidCount: number;
  /** Cuotas que EXISTEN. Con `cancelledAt` son menos que `debt.totalCuotas()`. */
  totalCuotas: number;
  remaining: number;
  isPaid: boolean;
  /** Cuotas vencidas de meses anteriores, sin pagar. Las más viejas primero. */
  overdue: CuotaStatus[];
  /** La cuota de este mes, si la deuda ya empezó y aún le quedan. */
  current: CuotaStatus | null;
}

/**
 * La deuda y su estado viajan juntos porque llegan juntos: separarlos obligaría a volver a cruzarlos
 * por id en cada pantalla, que es justo el trabajo que se subió al servidor.
 */
export interface DebtWithStatus {
  debt: Debt;
  status: DebtStatus;
}
