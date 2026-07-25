/**
 * RecurringJarSelector — Component
 *
 * @what     Selector de jarra de pago — chips con ícono/emoji real. Último paso compartido por los 4
 *           flujos (Ingreso/Gasto/Deuda/Lista).
 * @receives 3 props: jarra, jars, onChange
 * @processes Presentación pura. `jars` son las reales del workspace (FB-013: antes leía un catálogo
 *           de 9 claves hardcodeadas que no coincidía con ningún jarId real).
 * @returns  JSX — label + fila horizontal de chips con ícono o emoji.
 * @props    3: jarra, jars, onChange
 */
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius } from '@shared/styles';
import type { JarOption } from '@features/transactions/types';

type Props = { jarra: string; jars: JarOption[]; onChange: (v: string) => void };

export function RecurringJarSelector({ jarra, jars, onChange }: Props) {
  return (
    <View style={styles.block}>
      <Text style={styles.fieldLabel}>Jarra de pago</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segRow}>
        {jars.map((jar) => {
          const isActive = jarra === jar.id;
          return (
            <Pressable key={jar.id} style={[styles.jarraItem, isActive && styles.jarraItemActive]} onPress={() => onChange(jar.id)}>
              {jar.emoji
                ? <Text style={styles.emoji}>{jar.emoji}</Text>
                : jar.iconName && <MaterialIcons name={jar.iconName} size={16} color={isActive ? colors.pureWhite : colors.slateGray} />}
              <Text style={[styles.segText, isActive && styles.segTextActive]}>{jar.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block:      { gap: spacing.stackSm },
  fieldLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  segRow:     { flexDirection: 'row', gap: spacing.stackSm },
  jarraItem:  { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs, paddingVertical: spacing.stackSm, paddingHorizontal: spacing.gutter, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant },
  jarraItemActive: { backgroundColor: colors.emeraldSuccess, borderColor: colors.emeraldSuccess },
  emoji:           { fontSize: 14, includeFontPadding: false },
  segText:         { ...typography.labelMd, color: colors.slateGray },
  segTextActive:   { color: colors.pureWhite },
});
