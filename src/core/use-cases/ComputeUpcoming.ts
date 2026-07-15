/**
 * ComputeUpcoming — Use Case
 *
 * @what     Los próximos compromisos, derivados de la BD. Alimenta "Próximos" del Dashboard.
 * @receives items: PendingItem[] · debts: Debt[] · txs: Transaction[] · today: Date · limit?: number
 * @processes **Una sola fuente para el Dashboard y la Agenda** (C5). Antes el Dashboard tenía su
 *           propia lista escrita a mano (`MOCK_UPCOMING`): pagabas la renta en la Agenda y el
 *           Dashboard seguía pidiéndotela.
 *           Un **compromiso** es una fecha en la que se mueve dinero — entre o salga. Entra todo lo
 *           que sigue pendiente:
 *           - `pendingItems` no confirmados, `pago` **e** `ingreso` (el sueldo del 1 también es una cita).
 *           - las cuotas vivas de cada deuda: **las atrasadas de meses anteriores** y la de este mes.
 *             Las atrasadas se acumulan (decisión 2026-07-14): saltarte julio no borra julio.
 *           Ordenado por fecha: lo primero que llega, primero — así lo vencido sube arriba solo.
 * @returns  UpcomingCommitment[] — más cercano primero.
 */
import { Debt } from '../entities/Debt';
import { Transaction } from '../entities/Transaction';
import { PendingItem, PendingItemType } from '../ports/IAgendaRepository';
import { ComputeDebtStatus, CuotaStatus } from './ComputeDebtStatus';

export interface UpcomingCommitment {
  id: string;
  description: string;
  amount: number;
  type: PendingItemType; // 'pago' sale, 'ingreso' entra. Una cuota siempre es 'pago'.
  dueDate: Date;
  jarId: string;
  debtId?: string;
  cuotaMonth?: string;
}

export class ComputeUpcoming {
  private readonly computeStatus = new ComputeDebtStatus();

  execute(items: PendingItem[], debts: Debt[], txs: Transaction[], today: Date, limit?: number): UpcomingCommitment[] {
    const fromItems: UpcomingCommitment[] = items
      .filter((i) => i.status !== 'confirmado')
      .map((i) => ({
        id: i.id,
        description: i.description,
        amount: i.amount,
        type: i.type,
        dueDate: i.dueDate,
        jarId: i.jarId,
      }));

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

    const ordered = [...fromItems, ...fromDebts].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    return limit ? ordered.slice(0, limit) : ordered;
  }
}
