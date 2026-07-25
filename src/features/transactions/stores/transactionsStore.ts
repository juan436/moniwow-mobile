/**
 * transactionsStore — Zustand store
 *
 * @what     Fuente ÚNICA del libro en memoria. Todo lo que la app deriva —balances de jarras,
 *           patrimonio, movimientos, y mañana fugas/distribución/barChart— sale de aquí.
 * @processes `load` hidrata una vez desde `transactionRepository` (idempotente: varias pantallas
 *           montan a la vez). `add` escribe la transacción y la publica al estado, para que quien
 *           la esté mirando se entere. Antes cada hook leía el repo por su cuenta con un `useEffect`
 *           y nadie se enteraba de un guardado: registrabas un gasto y la pantalla no se movía.
 *           **`reset` (FB-019):** mismo bug que `jarsStore` — `hydrating` module-level queda TRUE
 *           para siempre tras la primera carga, así que cambiar de cuenta/workspace sin matar la app
 *           dejaba el libro de la cuenta ANTERIOR pegado (y con él, todo lo derivado: fugas,
 *           distribución, Últimos movimientos). `reset()` limpia y desarma el candado.
 * @returns  useTransactionsStore hook (selectores).
 */
import { create } from 'zustand';

import { Transaction } from '@core/entities/Transaction';
import { transactionRepository } from '@infrastructure/container';

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado

type TransactionsState = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
  add: (transaction: Transaction) => Promise<void>;
  /** Vacía el store y desarma el candado de hidratación — llamar al cambiar de cuenta/workspace. */
  reset: () => void;
};

// El libro se guarda en orden cronológico; la app lo lee al revés (lo último, arriba).
function byNewestFirst(txs: Transaction[]): Transaction[] {
  return [...txs].sort((a, b) => b.date.getTime() - a.date.getTime());
}

// Hidratación en vuelo: compartida entre todas las pantallas que la piden a la vez.
let hydrating: Promise<void> | null = null;

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  isLoading: true,
  error: null,

  load: () => {
    if (hydrating) return hydrating;
    hydrating = transactionRepository
      .findByWorkspace(WORKSPACE_ID)
      .then((txs) => set({ transactions: byNewestFirst(txs), isLoading: false }))
      .catch(() => set({ error: 'No se pudieron cargar los movimientos', isLoading: false }));
    return hydrating;
  },

  add: async (transaction) => {
    set((s) => ({ transactions: [transaction, ...s.transactions] }));
  },

  reset: () => {
    hydrating = null;
    set({ transactions: [], isLoading: true, error: null });
  },
}));
