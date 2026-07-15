/**
 * ConfirmPendingItem — Use Case
 *
 * @what     Confirmar un compromiso de la agenda: "Pagar" (un gasto) o "¡Llegó!" (un ingreso).
 * @receives ConfirmPendingItemInput — id de la transacción, id del compromiso, workspace, usuario.
 * @processes **Escribe el movimiento en el libro.** Antes, pulsar Pagar solo daba la vuelta a un
 *           booleano en memoria: la renta se marcaba pagada y el balance de Hogar ni se enteraba.
 *           `type: 'pago'` → gasto en la jarra del compromiso. `type: 'ingreso'` → ingreso en ella.
 *           El balance de la jarra se deriva del libro (C4): basta con registrar el movimiento.
 *           Sustituye a `ConfirmIncome`, que solo cubría los ingresos y era código muerto.
 * @returns  { transaction, item } — el compromiso ya confirmado.
 */
import { Transaction } from '../entities/Transaction';
import { IJarRepository } from '../ports/IJarRepository';
import { ITransactionRepository } from '../ports/ITransactionRepository';
import { IAgendaRepository, PendingItem } from '../ports/IAgendaRepository';

export interface ConfirmPendingItemInput {
  id: string;
  pendingItemId: string;
  workspaceId: string;
  userId: string;
}

export interface ConfirmPendingItemResult {
  transaction: Transaction;
  item: PendingItem;
}

export class ConfirmPendingItem {
  constructor(
    private readonly jarRepo: IJarRepository,
    private readonly transactionRepo: ITransactionRepository,
    private readonly agendaRepo: IAgendaRepository,
  ) {}

  async execute(input: ConfirmPendingItemInput): Promise<ConfirmPendingItemResult> {
    const items = await this.agendaRepo.findByWorkspace(input.workspaceId);
    const item = items.find((i) => i.id === input.pendingItemId);
    if (!item) throw new Error(`Pending item ${input.pendingItemId} not found`);
    if (item.status === 'confirmado') throw new Error('Este compromiso ya estaba confirmado');

    const jar = await this.jarRepo.findById(item.jarId);
    if (!jar) throw new Error(`Jar ${item.jarId} not found`);

    const transaction = new Transaction({
      id: input.id,
      amount: item.amount,
      jarId: jar.id,
      type: item.type === 'ingreso' ? 'ingreso' : 'gasto',
      description: item.description,
      date: new Date(),
      workspaceId: input.workspaceId,
      userId: input.userId,
    });

    const confirmed: PendingItem = { ...item, status: 'confirmado' };

    await this.transactionRepo.save(transaction);
    await this.agendaRepo.update(confirmed);

    return { transaction, item: confirmed };
  }
}
