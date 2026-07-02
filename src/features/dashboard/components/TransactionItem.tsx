/**
 * TransactionItem — Component
 *
 * @what     Fila de movimiento en la card de Últimos Movimientos.
 * @receives 2 props: transaction, onLongPress
 * @processes Colorea monto según isIncome. Oculta borde en último ítem.
 * @returns  JSX — row con ícono circular, descripción/categoría y monto/hora.
 * @props    2: transaction, onLongPress
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import type { TransactionDisplay } from '@features/transactions/types';

type Props = {
  transaction: TransactionDisplay;
  onLongPress?: (tx: TransactionDisplay) => void;
};

export function TransactionItem({ transaction, onLongPress }: Props) {
  const amountStyle = transaction.isIncome ? styles.amountIncome : styles.amountExpense;
  const prefix      = transaction.isIncome ? '+' : '-';

  function handleLongPress() { onLongPress?.(transaction); }

  return (
    <Pressable style={[styles.row, !transaction.isLast && styles.rowBorder]} onLongPress={handleLongPress} delayLongPress={400}>
      <View style={[styles.iconCircle, { backgroundColor: transaction.iconBg }]}>
        <MaterialIcons name={transaction.iconName} size={20} color={transaction.iconColor} />
      </View>

      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(transaction.description)}</Text>
        <Text style={styles.category} numberOfLines={1}>{transaction.categoryLabel}</Text>
      </View>

      <View style={styles.rightCol}>
        <Text style={[styles.amount, amountStyle]} numberOfLines={1} ellipsizeMode="tail">
          {prefix}${transaction.amount.toFixed(2)}
        </Text>
        <Text style={styles.time} numberOfLines={1} ellipsizeMode="tail">{transaction.time}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutter,
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.stackMd,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '1A',
  },
  iconCircle: {
    width: sizes.iconMd,
    height: sizes.iconMd,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: spacing.stackXxs,
  },
  description: {
    ...typography.labelMd,
    color: colors.onBackground,
  },
  category: {
    ...typography.labelSm,
    color: colors.slateGray,
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: spacing.stackXxs,
    flexShrink: 0,
    maxWidth: 110,
    minWidth: 72,
  },
  amount: {
    ...typography.labelMd,
    maxWidth: 110,
  },
  amountIncome:  { color: colors.emeraldSuccess },
  amountExpense: { color: colors.alertOrange },
  time: {
    ...typography.labelSm,
    color: colors.slateGray,
    maxWidth: 110,
  },
});
