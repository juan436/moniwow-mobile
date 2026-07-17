/**
 * CancelDebt — Use Case
 *
 * @what     Cancelar una deuda: las cuotas que aún no vencieron dejan de pedirse. **No borra la
 *           fila ni toca el libro.** Espejo de `CancelRecurrence`.
 * @receives CancelDebtInput — debtId, today.
 * @processes Escribe `cancelledAt`; `ComputeDebtStatus` deja de generar las cuotas con mes
 *           posterior.
 *           **Corta en la última cuota que YA VENCIÓ** — cancelar mata el futuro, no perdona el
 *           pasado. Deuda de 4 cuotas, pagaste 1 y 2, la 3 venció y no la pagaste: al cancelar hoy
 *           la 3 **la seguís debiendo** y solo muere la 4. `remaining` queda en el valor de la 3,
 *           no en 0.
 *           Si la cuota de este mes todavía no venció, el corte es el mes pasado: no se debe algo
 *           que no llegó a vencer.
 *           Cancelar una deuda no es "ya no la debo": es que alguien te la perdonó, la
 *           refinanciaste o la pagaste de golpe. Que la app lo permita no la hace verdad — eso lo
 *           decide quien llama.
 * @returns  { debt } — la deuda con `cancelledAt` puesto.
 */
import { Debt } from '../entities/Debt';
import { IDebtRepository } from '../ports/IDebtRepository';
import { monthKey } from './ComputeMonthlyTotals';

export interface CancelDebtInput {
  debtId: string;
  today: Date;
}

export interface CancelDebtResult {
  debt: Debt;
}

export class CancelDebt {
  constructor(private readonly debtRepo: IDebtRepository) {}

  async execute(input: CancelDebtInput): Promise<CancelDebtResult> {
    const debt = await this.debtRepo.findById(input.debtId);
    if (!debt) throw new Error(`Debt ${input.debtId} not found`);
    if (debt.cancelledAt !== undefined) throw new Error('Esta deuda ya está cancelada');

    const thisMonth = monthKey(input.today);
    const lastDue   = lastDueMonth(debt, input.today);

    // Ninguna cuota venció todavía → no hay pasado que conservar. Se borra, no se cancela.
    if (lastDue === null) throw new Error('Esta deuda no tiene ninguna cuota vencida');

    const cancelled = new Debt({ ...debt, cancelledAt: lastDue > thisMonth ? thisMonth : lastDue });
    await this.debtRepo.update(cancelled);

    return { debt: cancelled };
  }
}

/** Mes de la última cuota que ya venció, o `null` si ninguna venció. */
function lastDueMonth(debt: Debt, today: Date): string | null {
  let last: string | null = null;
  for (let n = 1; n <= debt.totalCuotas(); n += 1) {
    const dueDate = debt.cuotaDueDate(n);
    if (dueDate > today) break;
    last = monthKey(dueDate);
  }
  return last;
}
