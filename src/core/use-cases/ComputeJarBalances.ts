/**
 * ComputeJarBalances — Use Case
 *
 * @what     Deriva el balance de cada jarra del libro de transacciones. Resuelve C4: el balance
 *           NO se almacena — es la suma de lo que entró menos lo que salió. Una sola verdad.
 * @receives txs: Transaction[] — el libro completo del workspace.
 * @processes ingreso → suma en `jarId`. gasto → resta de `jarId`. transferencia → resta de `jarId`
 *           (origen) y suma en `toJarId` (destino): las dos caras del mismo movimiento, por eso
 *           una transferencia no crea ni destruye patrimonio.
 * @returns  Map<jarId, balance>. Una jarra sin movimientos no aparece → su balance es 0.
 */
import { Transaction } from '../entities/Transaction';

export class ComputeJarBalances {
  execute(txs: Transaction[]): Map<string, number> {
    const balances = new Map<string, number>();

    const add = (jarId: string, delta: number): void => {
      balances.set(jarId, (balances.get(jarId) ?? 0) + delta);
    };

    for (const tx of txs) {
      if (tx.type === 'ingreso') {
        add(tx.jarId, tx.amount);
      } else if (tx.type === 'gasto') {
        add(tx.jarId, -tx.amount);
      } else if (tx.toJarId) {
        add(tx.jarId, -tx.amount);
        add(tx.toJarId, tx.amount);
      }
    }

    return balances;
  }
}
