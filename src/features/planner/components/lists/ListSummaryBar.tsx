/**
 * ListSummaryBar — Component
 *
 * @what     Barra lineal de una lista, todo en una fila: progreso · **cuánto cuesta comprarla
 *           entera** (dato dominante) · limpiar (cepillo) · dictar por voz.
 * @receives 4 props: done, total, approxTotal, onClear
 * @processes Solo formatea: `approxTotal` llega ya sumado del dominio (`List.approxTotal()`). El
 *           total encoge la fuente si el monto es largo (`adjustsFontSizeToFit`) para que la fila
 *           NUNCA se parta en dos ni empuje los botones fuera. Es una tarjeta con `cardPadding`: los
 *           botones quedan a 16 del borde + 24 del margen de página, sin pegarse nunca al borde.
 *           Limpiar se oculta con la lista vacía (no hay nada que deschulear).
 * @returns  JSX — tarjeta con una única fila horizontal.
 * @props    4: done, total, approxTotal, onClear
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius } from '@shared/styles';
import { ListMicButton } from './ListMicButton';

type Props = {
  done: number;
  total: number;
  approxTotal: number;
  purchasedTotal: number;
  onClear: () => void;
};

export function ListSummaryBar({ done, total, approxTotal, purchasedTotal, onClear }: Props) {
  return (
    <View style={styles.bar}>
      <View style={styles.info}>
        <Text style={styles.progress}>{done}/{total} comprados</Text>
        <View style={styles.totalLine}>
          <Text style={styles.totalLabel}>Total lista</Text>
          <Text style={styles.total} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
            $ {approxTotal.toFixed(2)}
          </Text>
        </View>
        <Text style={styles.purchased} numberOfLines={1}>
          Total a comprar $ {purchasedTotal.toFixed(2)}
        </Text>
      </View>
      {total > 0 && (
        <Pressable style={styles.iconBtn} onPress={onClear} hitSlop={8}>
          <MaterialIcons name="cleaning-services" size={20} color={colors.primary} />
        </Pressable>
      )}
      <ListMicButton />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm,
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl,
    paddingHorizontal: spacing.cardPadding, paddingVertical: spacing.stackSm,
    borderWidth: 1, borderColor: colors.surfaceContainerHighest,
  },
  // flex:1 → el bloque se queda el espacio libre y empuja los botones al extremo, sin margen fijo.
  info:     { flex: 1, gap: spacing.stackXxs },
  progress: { ...typography.labelMd, color: colors.slateGray },
  // El rótulo va chico y gris al lado del monto: nombra el dato sin restarle peso al número.
  totalLine:  { flexDirection: 'row', alignItems: 'baseline', gap: spacing.stackXs },
  totalLabel: { ...typography.labelSm, color: colors.slateGray },
  total:      { ...typography.headlineMd, color: colors.alertOrange, flexShrink: 1 },
  // Secundario a propósito: el dato que manda es lo que cuesta la lista, esto es el avance del viaje.
  purchased: { ...typography.labelMdBold, color: colors.emeraldSuccess },
  iconBtn:  { padding: spacing.stackSm, backgroundColor: colors.surfaceContainerLow, borderRadius: radius.full },
});
