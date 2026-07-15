/**
 * PayDebtCuota — Use Case
 *
 * @what     Pagar UNA cuota concreta de una deuda (la de este mes o una atrasada).
 * @receives PayDebtCuotaInput — id de la transacción, deuda, `cuotaMonth` que se salda, workspace, usuario.
 * @processes Escribe el gasto en el libro por `debt.cuotaAmount()`, desde **la jarra que la deuda
 *           declaró al crearse** (`sourceJarId`) — antes había un `?? 'libre'` que se inventaba el
 *           origen cuando el dato faltaba.
 *           `date` = cuándo pagas (hoy). `cuotaMonth` = **qué cuota cubres**. Pagar en agosto la
 *           cuota atrasada de julio son dos hechos distintos y el libro guarda los dos.
 *           **Ya no toca `paidCuotas`**: ese contador no existe. Cuántas llevas se CUENTA del libro
 *           (`ComputeDebtStatus`), y así se sabe además cuáles te saltaste.
 *           Guard: esa cuota concreta no puede pagarse dos veces.
 * @returns  { transaction }
 */
import { Transaction } from '../entities/Transaction';
import { IDebtRepository } from '../ports/IDebtRepository';
import { IJarRepository } from '../ports/IJarRepository';
import { ITransactionRepository } from '../ports/ITransactionRepository';
import { ComputeDebtStatus } from './ComputeDebtStatus';

export interface PayDebtCuotaInput {
  id: string;
  debtId: string;
  /** Mes de la cuota que se salda ('YYYY-MM'). No tiene por qué ser el mes actual. */
  cuotaMonth: string;
  workspaceId: string;
  userId: string;
}

export interface PayDebtCuotaResult {
  transaction: Transaction;
}

export class PayDebtCuota {
  private readonly computeStatus = new ComputeDebtStatus();

  constructor(
    private readonly debtRepo: IDebtRepository,
    private readonly jarRepo: IJarRepository,
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(input: PayDebtCuotaInput): Promise<PayDebtCuotaResult> {
    const debt = await this.debtRepo.findById(input.debtId);
    if (!debt) throw new Error(`Debt ${input.debtId} not found`);

    const jar = await this.jarRepo.findById(debt.sourceJarId);
    if (!jar) throw new Error(`Jar ${debt.sourceJarId} not found`);

    const date   = new Date();
    const txs    = await this.transactionRepo.findByWorkspace(input.workspaceId);
    const status = this.computeStatus.execute(debt, txs, date);

    if (status.isPaid) throw new Error('Esta deuda ya está saldada');

    const alreadyPaid = txs.some((t) => t.debtId === debt.id && t.cuotaMonth === input.cuotaMonth);
    if (alreadyPaid) throw new Error('Esa cuota ya está pagada');

    const transaction = new Transaction({
      id: input.id,
      amount: debt.cuotaAmount(),
      jarId: jar.id,
      type: 'gasto',
      description: `Cuota: ${debt.description}`,
      date,
      debtId: debt.id,
      cuotaMonth: input.cuotaMonth,
      workspaceId: input.workspaceId,
      userId: input.userId,
    });

    await this.transactionRepo.save(transaction);

    return { transaction };
  }
}
