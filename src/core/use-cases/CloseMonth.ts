import { IAgendaRepository, PendingItem } from '../ports/IAgendaRepository';

export interface CloseMonthInput {
  workspaceId: string;
}

export interface CloseMonthResult {
  markedOverdue: PendingItem[];
}

export class CloseMonth {
  constructor(private readonly agendaRepo: IAgendaRepository) {}

  async execute(input: CloseMonthInput): Promise<CloseMonthResult> {
    const pending = await this.agendaRepo.findPending(input.workspaceId);
    const now = new Date();

    const markedOverdue: PendingItem[] = [];

    for (const item of pending) {
      if (item.dueDate < now && item.status === 'pendiente') {
        const overdue: PendingItem = { ...item, status: 'atrasado' };
        await this.agendaRepo.update(overdue);
        markedOverdue.push(overdue);
      }
    }

    // Saldos NO se resetean — roll-over por diseño del dominio

    return { markedOverdue };
  }
}
