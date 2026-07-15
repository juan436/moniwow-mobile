/**
 * ComputeSpendingByJar — Use Case
 *
 * @what     Cuánto se gastó en cada jarra durante un mes. Alimenta la card "Distribución del gasto".
 * @receives txs: Transaction[] · month: string ('YYYY-MM').
 * @processes Solo `type === 'gasto'`. **Un solo eje: la jarra.** El mock mezclaba jarras con
 *           "Hormiga" y "Deudas" en el mismo gráfico — tres ejes distintos peleando por el mismo
 *           espacio (decisión 2026-07-14). Las jarras YA son la taxonomía del gasto.
 *           Transferencias e ingresos fuera: no son gasto.
 * @returns  Map<jarId, total gastado ese mes>. Una jarra sin gastos no aparece.
 */
import { Transaction } from '../entities/Transaction';
import { monthKey } from './ComputeMonthlyTotals';

export class ComputeSpendingByJar {
  execute(txs: Transaction[], month: string): Map<string, number> {
    const spending = new Map<string, number>();

    for (const tx of txs) {
      if (tx.type !== 'gasto') continue;
      if (monthKey(tx.date) !== month) continue;

      spending.set(tx.jarId, (spending.get(tx.jarId) ?? 0) + tx.amount);
    }

    return spending;
  }
}
