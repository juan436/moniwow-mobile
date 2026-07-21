/**
 * HttpSummaryRepository — Adapter (HTTP)
 *
 * @what     Implementa ISummaryRepository contra `GET /summary`.
 * @receives query opcional: chartMonths · upcomingLimit.
 * @processes Traduce el JSON al dominio: los dos objetos planos vuelven a ser `Map` y `dueDate`
 *           vuelve a ser `Date`.
 * @returns  Promise<Summary>
 *
 * **Los `Map` viajan como objetos porque no hay otra forma.** `JSON.stringify(new Map())` devuelve
 * `{}` — sin error y sin aviso; el servidor los convierte a mano y acá se deshace la conversión. Si
 * alguna vez `balances` llega vacío con datos detrás, mirar primero este par de líneas.
 */
import type { ISummaryRepository, SummaryQuery } from '@core/ports/ISummaryRepository';
import type { CommitmentType, Summary, MonthTotals, UpcomingCommitment } from '@core/types/Summary';

import { request } from './httpClient';

interface UpcomingDto {
  id: string;
  description: string;
  amount: number;
  type: string;
  dueDate: string;
  jarId: string;
  debtId?: string;
  cuotaMonth?: string;
  recurrenceId?: string;
  recurrenceMonth?: string;
}

interface SummaryDto {
  patrimonio: number;
  balances: Record<string, number>;
  monthlyTotals: MonthTotals[];
  spendingByJar: Record<string, number>;
  upcoming: UpcomingDto[];
  month: string;
}

const toUpcoming = (dto: UpcomingDto): UpcomingCommitment => ({
  ...dto,
  type: dto.type as CommitmentType,
  dueDate: new Date(dto.dueDate),
});

function queryString(query: SummaryQuery): string {
  const params = new URLSearchParams();
  if (query.chartMonths !== undefined) params.set('chartMonths', String(query.chartMonths));
  if (query.upcomingLimit !== undefined) params.set('upcomingLimit', String(query.upcomingLimit));
  if (query.month !== undefined) params.set('month', query.month);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export class HttpSummaryRepository implements ISummaryRepository {
  async find(query: SummaryQuery = {}): Promise<Summary> {
    const dto = await request<SummaryDto>(`/summary${queryString(query)}`);
    return {
      patrimonio: dto.patrimonio,
      balances: new Map(Object.entries(dto.balances)),
      monthlyTotals: dto.monthlyTotals,
      spendingByJar: new Map(Object.entries(dto.spendingByJar)),
      upcoming: dto.upcoming.map(toUpcoming),
      month: dto.month,
    };
  }
}
