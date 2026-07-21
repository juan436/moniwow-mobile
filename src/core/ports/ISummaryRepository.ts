import { Summary } from '../types/Summary';

export interface SummaryQuery {
  /** Cuántos meses de `monthlyTotals` devolver, los más recientes. */
  chartMonths?: number;
  /** Cuántos compromisos próximos devolver. */
  upcomingLimit?: number;
  /** Mes ('YYYY-MM') del reparto de gasto. Sin él, el servidor usa el mes en curso. */
  month?: string;
}

export interface ISummaryRepository {
  find(query?: SummaryQuery): Promise<Summary>;
}
