/**
 * ListPreview — Component
 *
 * @what     Vista previa de una lista de compras en el paso final del asistente Crear lista.
 * @receives 3 props: nombre, emoji, jarra
 * @processes Presentación pura: avatar con el emoji elegido + nombre + chip con la jarra de pago
 *           (label + ícono resueltos desde RECURRING_JARS).
 * @returns  JSX — card con avatar, nombre y chip de jarra.
 * @props    3: nombre, emoji, jarra
 */
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius } from '@shared/styles';
import { RECURRING_JARS } from '../../jarOptions';
import type { RecurringJar } from '../../types';

type Props = { nombre: string; emoji: string; jarra: RecurringJar };

export function ListPreview({ nombre, emoji, jarra }: Props) {
  const jar = RECURRING_JARS.find((j) => j.key === jarra);
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : <MaterialIcons name="shopping-cart" size={28} color={colors.emeraldSuccess} />}
      </View>
      <Text style={styles.name}>{nombre.trim() || 'Lista sin nombre'}</Text>
      {jar && (
        <View style={styles.chip}>
          <MaterialIcons name={jar.iconName} size={14} color={colors.slateGray} />
          <Text style={styles.chipText}>{jar.label}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card:     { alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackLg, backgroundColor: colors.emeraldTint, borderRadius: radius.card, borderWidth: 1, borderColor: colors.emeraldBorder },
  avatar:   { width: 64, height: 64, borderRadius: radius.full, backgroundColor: colors.pureWhite, alignItems: 'center', justifyContent: 'center' },
  emoji:    { fontSize: 30, includeFontPadding: false },
  name:     { ...typography.headlineMd, color: colors.navyDark },
  chip:     { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs, paddingVertical: spacing.stackXs, paddingHorizontal: spacing.gutter, borderRadius: radius.full, backgroundColor: colors.pureWhite },
  chipText: { ...typography.labelMd, color: colors.slateGray },
});
