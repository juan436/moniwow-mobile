/**
 * ComputeMonthlyTotals — Use Case
 *
 * @what     Ingresos y gastos de cada mes, derivados del libro. Alimenta el barChart de Revisión.
 * @receives txs: Transaction[] · months?: number — cuántos meses devolver (los más recientes).
 * @processes Agrupa por mes de `date`. **Las transferencias NO cuentan**: mover $300 de Hogar a Fondo
 *           no te hace más rico ni más pobre — contarlas inflaría los ingresos del mes.
 *           **Solo devuelve meses CON movimientos.** Nunca rellena con ceros: un mes vacío y un mes
 *           en cero son cosas distintas (en marzo no ganaste $0, es que la app no existía).
 * @returns  MonthTotals[] en orden cronológico (el más antiguo primero).
 */
import { Transaction } from '../entities/Transaction';

export interface MonthTotals {
  key: string; // 'YYYY-MM'
  ingresos: number;
  gastos: number;
}

export class ComputeMonthlyTotals {
  execute(txs: Transaction[], months?: number): MonthTotals[] {
    const byMonth = new Map<string, MonthTotals>();

    for (const tx of txs) {
      if (tx.isTransfer()) continue;

      const key = monthKey(tx.date);
      const row = byMonth.get(key) ?? { key, ingresos: 0, gastos: 0 };

      if (tx.type === 'ingreso') row.ingresos += tx.amount;
      else row.gastos += tx.amount;

      byMonth.set(key, row);
    }

    const ordered = [...byMonth.values()].sort((a, b) => a.key.localeCompare(b.key));
    return months ? ordered.slice(-months) : ordered;
  }
}

export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}
