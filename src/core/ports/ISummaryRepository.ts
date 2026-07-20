import { Summary } from '../types/Summary';

export interface SummaryQuery {
  /** Cuántos meses de `monthlyTotals` devolver, los más recientes. */
  chartMonths?: number;
  /** Cuántos compromisos próximos devolver. */
  upcomingLimit?: number;
}

export interface ISummaryRepository {
  find(query?: SummaryQuery): Promise<Summary>;
}
