/**
 * ListPreview — Component
 *
 * @what     Vista previa de una lista de compras en el paso final del asistente Crear lista.
 * @receives 4 props: nombre, emoji, jarra, jars
 * @processes Presentación pura: avatar con el emoji elegido + nombre + chip con la jarra de pago
 *           (nombre + ícono/emoji de la jarra REAL, FB-013 — antes venía de un catálogo hardcodeado).
 * @returns  JSX — card con avatar, nombre y chip de jarra.
 * @props    4: nombre, emoji, jarra, jars
 */
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius } from '@shared/styles';
import type { JarOption } from '@features/transactions/types';

type Props = { nombre: string; emoji: string; jarra: string; jars: JarOption[] };

export function ListPreview({ nombre, emoji, jarra, jars }: Props) {
  const jar = jars.find((j) => j.id === jarra);
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : <MaterialIcons name="shopping-cart" size={28} color={colors.emeraldSuccess} />}
      </View>
      <Text style={styles.name}>{nombre.trim() || 'Lista sin nombre'}</Text>
      {jar && (
        <View style={styles.chip}>
          {jar.emoji
            ? <Text style={styles.chipEmoji}>{jar.emoji}</Text>
            : jar.iconName && <MaterialIcons name={jar.iconName} size={14} color={colors.slateGray} />}
          <Text style={styles.chipText}>{jar.name}</Text>
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
  chipEmoji: { fontSize: 14, includeFontPadding: false },
  chipText: { ...typography.labelMd, color: colors.slateGray },
});
