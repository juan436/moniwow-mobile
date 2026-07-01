/**
 * truncateText — Utility
 *
 * @what     Trunca un string a un máximo de caracteres con sufijo '…'.
 * @receives text: string, max?: number (default 22)
 * @processes Corta en max chars, trim trailing spaces, añade '…' si supera el límite.
 * @returns  string truncado o el original si cabe dentro del límite.
 */
export function truncateLabel(text: string, max = 22): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}
