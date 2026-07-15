/**
 * useConfirmFlow — Hook
 *
 * @what     Estado del modal de confirmación antes de escribir un compromiso (Pagar / ¡Llegó!).
 * @receives items: AgendaItemDisplay[] · onConfirm: (id: string) => void
 * @processes El toque NO escribe: abre el modal. Un ítem ya pagado no vuelve a preguntar. Compartido
 *           por Mi Mes, Atrasados y Por confirmar — los tres escriben un movimiento real e
 *           irreversible, así que ninguno debe hacerlo sin un OK explícito.
 * @returns  { asking, ask, confirm, cancel }
 */
import { useCallback, useState } from 'react';

import type { AgendaItemDisplay } from '../types';

export function useConfirmFlow(items: AgendaItemDisplay[], onConfirm: (id: string) => void) {
  const [asking, setAsking] = useState<AgendaItemDisplay | null>(null);

  const ask = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    setAsking(item && !item.isPaid ? item : null);
  }, [items]);

  const cancel = useCallback(() => setAsking(null), []);

  const confirm = useCallback(() => {
    if (asking) onConfirm(asking.id);
    setAsking(null);
  }, [asking, onConfirm]);

  return { asking, ask, confirm, cancel };
}
