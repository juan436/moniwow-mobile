/**
 * ComputeUpcoming — Use Case
 *
 * @what     Los próximos compromisos, derivados de la BD. Alimenta "Próximos" del Dashboard.
 * @receives recurrences: Recurrence[] · debts: Debt[] · txs: Transaction[] · today: Date · limit?: number
 * @processes **Una sola fuente para el Dashboard y la Agenda** (C5). Antes el Dashboard tenía su
 *           propia lista escrita a mano (`MOCK_UPCOMING`): pagabas la renta en la Agenda y el
 *           Dashboard seguía pidiéndotela.
 *           Un **compromiso** es una fecha en la que se mueve dinero — entre o salga. Entra todo lo
 *           que sigue pendiente:
 *           - las ocurrencias vivas de cada regla recurrente (`ComputeRecurringOccurrences`): la del
 *             mes y las atrasadas sin pagar. Gasto → 'pago', ingreso → 'ingreso' (el sueldo es cita).
 *           - las cuotas vivas de cada deuda: **las atrasadas de meses anteriores** y la de este mes.
 *             Las atrasadas se acumulan (decisión 2026-07-14): saltarte julio no borra julio.
 *           Ordenado por fecha: lo primero que llega, primero — así lo vencido sube arriba solo.
 * @returns  UpcomingCommitment[] — más cercano primero.
 */
import { Debt } from '../entities/Debt';
import { Recurrence } from '../entities/Recurrence';
import { Transaction } from '../entities/Transaction';
import { ComputeDebtStatus, CuotaStatus } from './ComputeDebtStatus';
import { ComputeRecurringOccurrences, RecurrenceOccurrence } from './ComputeRecurringOccurrences';

/** Hacia dónde se mueve el dinero en la fecha del compromiso. */
export type CommitmentType = 'ingreso' | 'pago';

export interface UpcomingCommitment {
  id: string;
  description: string;
  amount: number;
  type: CommitmentType; // 'pago' sale, 'ingreso' entra. Una cuota siempre es 'pago'.
  dueDate: Date;
  jarId: string;
  debtId?: string;
  cuotaMonth?: string;
  recurrenceId?: string;
  recurrenceMonth?: string;
}

export class ComputeUpcoming {
  private readonly computeStatus = new ComputeDebtStatus();
  private readonly computeRecurring = new ComputeRecurringOccurrences();

  execute(recurrences: Recurrence[], debts: Debt[], txs: Transaction[], today: Date, limit?: number): UpcomingCommitment[] {
    const fromRecurrences: UpcomingCommitment[] = recurrences.flatMap((rec) => {
      const status = this.computeRecurring.execute(rec, txs, today);
      const occurrences: RecurrenceOccurrence[] = [
        ...status.overdue,
        ...(status.current && !status.current.isPaid ? [status.current] : []),
      ];

      return occurrences.map((occ) => ({
        id: `rec-${rec.id}-${occ.month}`,
        description: rec.name,
        amount: occ.amount,
        type: rec.type === 'ingreso' ? ('ingreso' as const) : ('pago' as const),
        dueDate: occ.dueDate,
        jarId: rec.jarId,
        recurrenceId: rec.id,
        recurrenceMonth: occ.month,
      }));
    });

    const fromDebts: UpcomingCommitment[] = debts.flatMap((debt) => {
      const status = this.computeStatus.execute(debt, txs, today);
      const cuotas: CuotaStatus[] = [
        ...status.overdue,
        ...(status.current && !status.current.isPaid ? [status.current] : []),
      ];

      return cuotas.map((cuota) => ({
        id: `debt-${debt.id}-${cuota.month}`,
        description: debt.description,
        amount: cuota.amount,
        type: 'pago' as const,
        dueDate: cuota.dueDate,
        jarId: debt.sourceJarId,
        debtId: debt.id,
        cuotaMonth: cuota.month,
      }));
    });

    const ordered = [...fromRecurrences, ...fromDebts].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    return limit ? ordered.slice(0, limit) : ordered;
  }
}
