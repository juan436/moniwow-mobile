/**
 * ComputeDebtStatus — Use Case
 *
 * @what     El estado real de una deuda, derivado del libro: qué cuotas pagaste, cuáles debes y
 *           cuáles van atrasadas.
 * @receives debt: Debt · txs: Transaction[] · today: Date
 * @processes La deuda sabe qué meses le TOCABAN (una cuota al mes desde `createdAt`). El libro sabe
 *           cuáles PAGASTE (gastos con `debtId`, marcados con el `cuotaMonth` que cubren). Restar
 *           las dos listas da los atrasados. **Nada de esto se guarda**: un `paidCuotas` decía
 *           "llevas 7" sin decir cuáles, así que no podía saber que te saltaste mayo.
 *           `overdue` = cuotas de meses ANTERIORES sin pagar (se acumulan; la deuda no corre su
 *           calendario). `current` = la de este mes, si existe y toca.
 *           **Único pago** (`cuotas` ausente): `totalCuotas()` da 1 → genera una sola cuota por el
 *           total, en `dueDay`. Sin esa traducción el bucle no correría nunca y la deuda nacería
 *           saldada.
 *           **`cuotasPagadas`**: las n primeras cuentan como pagadas aunque no haya tx. No es el
 *           `paidCuotas` difunto — es historia PREVIA al registro, que el libro no puede saber
 *           porque pasó antes. Del registro en adelante manda el libro.
 * @returns  DebtStatus
 */
import { Debt } from '../entities/Debt';
import { Transaction } from '../entities/Transaction';
import { monthKey } from './ComputeMonthlyTotals';

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

export class ComputeDebtStatus {
  execute(debt: Debt, txs: Transaction[], today: Date): DebtStatus {
    const paidMonths = new Set(
      txs
        .filter((t) => t.debtId === debt.id && t.cuotaMonth !== undefined)
        .map((t) => t.cuotaMonth as string),
    );

    const thisMonth   = monthKey(today);
    const initialPaid = debt.initialPaid();
    const cuotas: CuotaStatus[] = [];

    for (let n = 1; n <= debt.totalCuotas(); n += 1) {
      const dueDate = debt.cuotaDueDate(n);
      const month   = monthKey(dueDate);
      // Cancelada: las cuotas que vencían DESPUÉS dejan de existir. Las vencidas siguen debiéndose.
      if (debt.cancelledAt !== undefined && month > debt.cancelledAt) continue;
      const isPaid = n <= initialPaid || paidMonths.has(month);
      cuotas.push({ month, number: n, dueDate, amount: debt.cuotaAmount(), isPaid });
    }

    const paidCount = cuotas.filter((c) => c.isPaid).length;

    return {
      paidCount,
      totalCuotas: cuotas.length,
      remaining: debt.cuotaAmount() * (cuotas.length - paidCount),
      isPaid: paidCount >= cuotas.length,
      overdue: cuotas.filter((c) => !c.isPaid && c.month < thisMonth),
      current: cuotas.find((c) => c.month === thisMonth) ?? null,
    };
  }
}
