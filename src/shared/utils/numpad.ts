/**
 * numpad — Utility
 *
 * @what     Aplica una tecla de numpad (dígito, punto o borrar) a un string de monto.
 * @receives current: string, key: string
 * @processes Bloquea doble punto decimal, limita 2 decimales, colapsa '0' inicial.
 * @returns  string — monto resultante tras aplicar la tecla.
 */
export function applyNumpadKey(current: string, key: string): string {
  if (key === '⌫') {
    const next = current.slice(0, -1);
    return next === '' ? '0' : next;
  }
  if (key === '.') return current.includes('.') ? current : current + '.';
  if (current === '0') return key;
  const decIdx = current.indexOf('.');
  if (decIdx !== -1 && current.length - decIdx > 2) return current;
  return current + key;
}
