/**
 * CancelRecurrence — Use Case
 *
 * @what     Cancelar una regla recurrente: deja de generar ocurrencias de acá en adelante. **No
 *           borra la fila ni toca el libro.**
 * @receives CancelRecurrenceInput — recurrenceId, today.
 * @processes Escribe `endMonth`; `appliesIn` ya lo respeta, así que
 *           `ComputeRecurringOccurrences` no se toca.
 *           **Corta en la última ocurrencia que YA VENCIÓ** — cancelar mata el futuro, no perdona
 *           el pasado. Netflix vence el 6 y cancelás el 16: julio ya venció, lo seguís debiendo →
 *           `endMonth` = julio. Vence el 20 y cancelás el 16: julio no venció, no lo debés →
 *           `endMonth` = junio.
 *           **Por qué no se borra la fila:** Mi Mes recorre REGLAS y por cada una le pregunta al
 *           libro "¿pagada?". Sin la regla el bucle nunca pasa por ahí y el compromiso desaparece
 *           de TODOS los meses, incluidos los que pagaste — el gasto queda en el libro pero suelto,
 *           sin nada que diga qué era. Borrar solo tiene sentido si no hay ni un pago (no hay
 *           historia que cuidar); eso lo decide quien llama.
 * @returns  { recurrence } — la regla con `endMonth` puesto.
 */
import { Recurrence } from '../entities/Recurrence';
import { IRecurrenceRepository } from '../ports/IRecurrenceRepository';
import { monthKey } from '../utils/monthKey';

export interface CancelRecurrenceInput {
  recurrenceId: string;
  today: Date;
}

export interface CancelRecurrenceResult {
  recurrence: Recurrence;
}

export class CancelRecurrence {
  constructor(private readonly recurrenceRepo: IRecurrenceRepository) {}

  async execute(input: CancelRecurrenceInput): Promise<CancelRecurrenceResult> {
    const rec = await this.recurrenceRepo.findById(input.recurrenceId);
    if (!rec) throw new Error(`Recurrence ${input.recurrenceId} not found`);

    const thisMonth = monthKey(input.today);

    // Una regla finita que ya terminó no se cancela: no le queda futuro que cortar.
    if (rec.endMonth !== undefined && rec.endMonth < thisMonth) {
      throw new Error('Esta regla ya terminó');
    }

    const endMonth = rec.dueDateFor(thisMonth) <= input.today
      ? thisMonth
      : previousMonth(thisMonth);

    // `endMonth` corta las ocurrencias (D5); `cancelledAt` la marca como cancelada para que salga
    // de "Compromisos activos" YA, aunque `endMonth` sea este mes (finita viva no se distinguiría).
    const cancelled = new Recurrence({ ...rec, endMonth, cancelledAt: thisMonth });
    await this.recurrenceRepo.update(cancelled);

    return { recurrence: cancelled };
  }
}

/** 'YYYY-MM' del mes anterior. Enero retrocede a diciembre del año pasado. */
function previousMonth(month: string): string {
  const [year, m] = month.split('-').map(Number);
  return monthKey(new Date(year, m - 2, 1));
}
