/**
 * PlannerItem — Component
 *
 * @what     Card compacta de ítem para Mi Mes. Layout row: emoji + info + botón acción.
 * @receives 2 props: item, onAction
 * @processes Todos los filtros: nombre → monto (color por filtro) → día. Compacto.
 * @returns  JSX — Card row con shadow.
 * @props    2: item, onAction
 */
import { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import type { AgendaFilter, AgendaItemDisplay } from '../../types';

type Props = {
  item: AgendaItemDisplay;
  onAction: (id: string) => void;
};

const BTN_LABEL: Record<AgendaFilter, string> = {
  gastos:   'Pagar',
  ingresos: '¡Llegó!',
  deudas:   'Pagar',
};

const BTN_LABEL_DONE: Record<AgendaFilter, string> = {
  gastos:   'Pagado ✓',
  ingresos: 'Recibido ✓',
  deudas:   'Pagado ✓',
};

const AMOUNT_STYLE: Record<AgendaFilter, { color: string }> = {
  gastos:   { color: colors.tertiary },
  ingresos: { color: colors.emeraldSuccess },
  deudas:   { color: colors.alertOrange },
};

export function PlannerItem({ item, onAction }: Props) {
  const btnLabel    = item.isPaid ? BTN_LABEL_DONE[item.filter] : BTN_LABEL[item.filter];
  const handlePress = useCallback(() => onAction(item.id), [item.id, onAction]);

  return (
    <View style={[styles.card, shadows.card, item.isPaid && styles.cardPaid]}>
      <View style={styles.row}>
        <View style={styles.emojiBox}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, item.isPaid && styles.namePaid]} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(item.name)}</Text>
          <Text style={[styles.amount, AMOUNT_STYLE[item.filter]]}>
            $ {item.amount.toLocaleString('es')}
          </Text>
          <Text style={styles.meta}>Día {item.day}</Text>
        </View>
        <Pressable style={[styles.btn, item.isPaid && styles.btnDone]} onPress={handlePress} hitSlop={8}>
          <Text style={[styles.btnText, item.isPaid && styles.btnTextDone]}>{btnLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.stackMd },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  emojiBox: {
    width: sizes.iconSm, height: sizes.iconSm,
    alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: sizes.emojiFontMd },
  info: { flex: 1 },
  name: { ...typography.labelMdBold, color: colors.navyDark },
  amount: { ...typography.labelMd, marginTop: spacing.stackXs },
  meta: { ...typography.labelSm, color: colors.slateGray },
  btn: {
    backgroundColor: colors.emeraldSuccess, borderRadius: radius.button,
    paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackSm,
    alignSelf: 'center',
  },
  btnText:     { ...typography.labelSm, color: colors.pureWhite },
  cardPaid:    { opacity: 0.6 },
  namePaid:    { textDecorationLine: 'line-through' },
  btnDone:     { backgroundColor: colors.surfaceContainerHigh },
  btnTextDone: { color: colors.slateGray },
});
