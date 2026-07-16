/**
 * ConfirmRecurrence — Use Case
 *
 * @what     Confirmar UNA ocurrencia de una regla recurrente: "Pagar" (un gasto) o "¡Llegó!" (un
 *           ingreso) — la de este mes o una atrasada.
 * @receives ConfirmRecurrenceInput — id tx, recurrenceId, `recurrenceMonth` que se cubre, workspace, usuario.
 * @processes **Escribe el movimiento en el libro** (gasto o ingreso según `rec.type`) en la jarra de
 *           la regla, marcado con `recurrenceId` + `recurrenceMonth`. `date` = cuándo confirmas;
 *           `recurrenceMonth` = QUÉ ocurrencia cubres (confirmar en agosto la de julio son dos hechos
 *           distintos). **No hay `status` guardado**: qué meses cubriste se CUENTA del libro
 *           (`ComputeRecurringOccurrences`). Espejo de `PayDebtCuota`.
 *           Guard: esa ocurrencia concreta no se confirma dos veces.
 * @returns  { transaction }
 */
import { Transaction } from '../entities/Transaction';
import { IJarRepository } from '../ports/IJarRepository';
import { IRecurrenceRepository } from '../ports/IRecurrenceRepository';
import { ITransactionRepository } from '../ports/ITransactionRepository';

export interface ConfirmRecurrenceInput {
  id: string;
  recurrenceId: string;
  /** Mes de la ocurrencia que se salda ('YYYY-MM'). No tiene por qué ser el mes actual. */
  recurrenceMonth: string;
  workspaceId: string;
  userId: string;
}

export interface ConfirmRecurrenceResult {
  transaction: Transaction;
}

export class ConfirmRecurrence {
  constructor(
    private readonly recurrenceRepo: IRecurrenceRepository,
    private readonly jarRepo: IJarRepository,
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(input: ConfirmRecurrenceInput): Promise<ConfirmRecurrenceResult> {
    const rec = await this.recurrenceRepo.findById(input.recurrenceId);
    if (!rec) throw new Error(`Recurrence ${input.recurrenceId} not found`);

    const jar = await this.jarRepo.findById(rec.jarId);
    if (!jar) throw new Error(`Jar ${rec.jarId} not found`);

    const txs = await this.transactionRepo.findByWorkspace(input.workspaceId);
    const alreadyDone = txs.some(
      (t) => t.recurrenceId === rec.id && t.recurrenceMonth === input.recurrenceMonth,
    );
    if (alreadyDone) throw new Error('Esa ocurrencia ya está confirmada');

    const transaction = new Transaction({
      id: input.id,
      amount: rec.amount,
      jarId: jar.id,
      type: rec.type, // RecurrenceType ('ingreso' | 'gasto') ⊂ TransactionType
      description: rec.name,
      date: new Date(),
      recurrenceId: rec.id,
      recurrenceMonth: input.recurrenceMonth,
      workspaceId: input.workspaceId,
      userId: input.userId,
    });

    await this.transactionRepo.save(transaction);
    return { transaction };
  }
}
