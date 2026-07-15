/**
 * mappers — Transactions Feature
 *
 * @what     Deriva `TransactionDisplay` (presentación) desde la entidad `Transaction` (dominio) +
 *           la presentación de su jarra. Display se DERIVA, nunca se inventa: signo, etiqueta,
 *           fecha legible e ícono salen de la entidad y del catálogo de la jarra.
 * @receives tx: Transaction · jar: JarPresentation (icon/color/nombre de la jarra dueña) · isLast?
 * @processes isIncome ← type · categoryLabel ← isHormiga|nombre jarra · time ← date formateada ·
 *           icono/color ← jarra · items ← TransactionItem dominio → Display (name→description).
 * @returns  TransactionDisplay
 */
import type { Transaction } from '@core/entities/Transaction';
import type { JarPresentation } from '@shared/styles';
import type { TransactionDisplay, TransactionItem } from './types';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** Fecha → etiqueta legible relativa (Hoy/Ayer) o absoluta (DD Mmm HH:MM). */
function formatWhen(date: Date, now: Date = new Date()): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const at = `${hh}:${mm}`;
  const daysApart = Math.floor(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / 86400000,
  );
  if (daysApart === 0) return `Hoy ${at}`;
  if (daysApart === 1) return `Ayer ${at}`;
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${at}`;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function mapItems(items: Transaction['items']): TransactionItem[] | undefined {
  if (!items) return undefined;
  return items.map((i) => ({ description: i.name, amount: i.amount }));
}

/** Etiqueta de categoría: gasto hormiga se rotula aparte; el resto lleva el nombre de su jarra. */
function categoryLabel(tx: Transaction, jar: JarPresentation): string {
  return tx.isHormiga() ? 'Hormiga 🐜' : jar.name;
}

export function toTransactionDisplay(
  tx: Transaction,
  jar: JarPresentation,
  isLast?: boolean,
): TransactionDisplay {
  return {
    id: tx.id,
    jarId: tx.jarId,
    description: tx.description,
    amount: tx.amount,
    isIncome: tx.type === 'ingreso',
    categoryLabel: categoryLabel(tx, jar),
    time: formatWhen(tx.date),
    iconName: jar.iconName,
    iconBg: jar.iconBg,
    iconColor: jar.iconColor,
    ...(isLast ? { isLast } : {}),
    ...(mapItems(tx.items) ? { items: mapItems(tx.items) } : {}),
    ...(tx.receiptUri ? { receiptUri: tx.receiptUri } : {}),
  };
}
