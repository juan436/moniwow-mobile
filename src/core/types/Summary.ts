/**
 * Summary — Types de dominio
 *
 * @what     Los números agregados del workspace: patrimonio, balance de cada jarra, totales por mes,
 *           gasto por jarra y los próximos compromisos.
 * @receives —
 * @processes Nada. Son la forma de lo que `GET /summary` devuelve.
 * @returns  —
 *
 * **Cinco cálculos en una sola llamada, y esa es la razón de que exista.** Antes el front se bajaba
 * el libro ENTERO (359 transacciones) en cada arranque para sumarlo cuatro veces con
 * `ComputeJarBalances`, `ComputeMonthlyTotals`, `ComputeSpendingByJar` y `ComputeUpcoming`. El
 * servidor lo lee una vez y manda los números.
 */

/** Hacia dónde se mueve el dinero en la fecha del compromiso. */
export type CommitmentType = 'ingreso' | 'pago';

export interface MonthTotals {
  key: string; // 'YYYY-MM'
  ingresos: number;
  gastos: number;
}

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

export interface Summary {
  patrimonio: number;
  /** jarId → saldo. `Map` acá aunque en el JSON sea un objeto: el adapter traduce. */
  balances: Map<string, number>;
  /** Orden cronológico, el más antiguo primero. Solo meses CON movimientos. */
  monthlyTotals: MonthTotals[];
  /** jarId → gastado en `month`. Una jarra sin gastos no aparece. */
  spendingByJar: Map<string, number>;
  /** Más cercano primero. Ya viene recortado a `upcomingLimit`. */
  upcoming: UpcomingCommitment[];
  /** El mes al que se refiere `spendingByJar`, 'YYYY-MM'. */
  month: string;
}
