/**
 * WithdrawFromGoal — Use Case
 *
 * @what     Slider de Sacrificio (M08): saca dinero de una meta y lo devuelve a Libre. Apaga estrellas.
 * @receives WithdrawFromGoalInput — id de la transacción, goalId, monto, workspace, usuario.
 * @processes Baja `goal.currentAmount` (dato propio de la meta, sí se persiste) y escribe UNA
 *           transacción `transferencia` de la jarra `goals` → `libre`. Antes sumaba a mano
 *           `libreJar.balance` y no dejaba rastro en el libro: el movimiento no existía en ningún
 *           sitio. Con el balance derivado (C4) eso haría desaparecer el dinero.
 * @returns  { goal, transaction, starsLost }
 */
import { Goal } from '../entities/Goal';
import { JarType } from '../entities/Jar';
import { Transaction } from '../entities/Transaction';
import { IJarRepository } from '../ports/IJarRepository';
import { IGoalRepository } from '../ports/IGoalRepository';
import { ITransactionRepository } from '../ports/ITransactionRepository';

export interface WithdrawFromGoalInput {
  id: string;
  goalId: string;
  amount: number;
  workspaceId: string;
  userId: string;
}

export interface WithdrawFromGoalResult {
  goal: Goal;
  transaction: Transaction;
  starsLost: number;
}

export class WithdrawFromGoal {
  constructor(
    private readonly goalRepo: IGoalRepository,
    private readonly jarRepo: IJarRepository,
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(input: WithdrawFromGoalInput): Promise<WithdrawFromGoalResult> {
    const goal = await this.goalRepo.findById(input.goalId);
    if (!goal) throw new Error(`Goal ${input.goalId} not found`);
    if (!goal.canWithdraw(input.amount)) throw new Error('Insufficient funds in goal');

    const jars = await this.jarRepo.findByWorkspace(input.workspaceId);
    const goalsJar = jars.find((j) => j.type === ('goals' as JarType));
    if (!goalsJar) throw new Error('Goals jar not found');

    const libreJar = jars.find((j) => j.type === ('libre' as JarType));
    if (!libreJar) throw new Error('Libre jar not found');

    const starsBefore = goal.stars();
    goal.currentAmount -= input.amount;
    const starsAfter = goal.stars();

    const transaction = new Transaction({
      id: input.id,
      amount: input.amount,
      jarId: goalsJar.id,
      toJarId: libreJar.id,
      type: 'transferencia',
      description: `Retiro de meta: ${goal.name}`,
      date: new Date(),
      workspaceId: input.workspaceId,
      userId: input.userId,
      // Mover dinero entre jarras propias no es un gasto: ni hormiga, ni nada que reste patrimonio.
      isHormiga: false,
      isTransfer: true,
    });

    await this.goalRepo.update(goal);
    await this.transactionRepo.save(transaction);

    return { goal, transaction, starsLost: starsBefore - starsAfter };
  }
}
