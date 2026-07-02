/**
 * DebtRow — Component
 *
 * @what     Fila individual de deuda: dot de color, label truncado, monto y barra de progreso.
 * @receives 3 props: item, color, onLongPress
 * @processes Trunca label, construye barra de progreso, delega long-press al padre.
 * @returns  JSX — Pressable con rowHeader + barTrack.
 * @props    3: item, color, onLongPress
 */
import { Pressable, View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import type { DebtBreakdown } from '../../types';

type Props = {
  item: DebtBreakdown;
  color: string;
  onLongPress: (item: DebtBreakdown) => void;
};

export function DebtRow({ item, color, onLongPress }: Props) {
  function handleLongPress() { onLongPress(item); }

  return (
    <Pressable onLongPress={handleLongPress} delayLongPress={400} style={styles.row}>
      <View style={styles.rowHeader}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.rowName} numberOfLines={1} ellipsizeMode="tail">
          {truncateLabel(item.label)}
        </Text>
        <Text style={styles.rowAmount}>$ {item.amount.toLocaleString('es')}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${item.progress}%` as `${number}%`, backgroundColor: color }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row:       { gap: spacing.stackSm },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  dot:       { width: sizes.dotSm, height: sizes.dotSm, borderRadius: radius.full, flexShrink: 0 },
  rowName:   { ...typography.labelMd, color: colors.navyDark, flex: 1, flexShrink: 1, minWidth: 0 },
  rowAmount: { ...typography.labelMd, color: colors.navyDark, flexShrink: 0, flexGrow: 0 },
  barTrack:  { height: sizes.trackXs, backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full, overflow: 'hidden' },
  barFill:   { height: '100%', borderRadius: radius.full },
});
