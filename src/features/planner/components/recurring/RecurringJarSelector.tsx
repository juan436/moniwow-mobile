/**
 * RecurringJarSelector — Component
 *
 * @what     Selector de jarra de pago — chips con MaterialIcons reales (mismo set que IconPicker
 *           de Jarras). Último paso compartido por los 4 flujos (Ingreso/Gasto/Deuda).
 * @receives 2 props: jarra, onChange
 * @processes Presentación pura.
 * @returns  JSX — label + fila horizontal de chips con ícono.
 * @props    2: jarra, onChange
 */
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { colors, typography, spacing, radius } from '@shared/styles';
import type { RecurringJar } from '../../types';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const JARRAS: { key: RecurringJar; label: string; iconName: IconName }[] = [
  { key: 'hogar',       label: 'Hogar',        iconName: 'home' },
  { key: 'goals',       label: 'Metas',        iconName: 'savings' },
  { key: 'libre',       label: 'Libre',        iconName: 'account-balance-wallet' },
  { key: 'transporte',  label: 'Transporte',   iconName: 'directions-bus' },
  { key: 'salud',       label: 'Salud',        iconName: 'favorite' },
  { key: 'educacion',   label: 'Educación',    iconName: 'school' },
  { key: 'viajes',      label: 'Viajes',       iconName: 'flight' },
  { key: 'emergencias', label: 'Emergencias',  iconName: 'security' },
  { key: 'ocio',        label: 'Ocio',         iconName: 'sports-esports' },
];

type Props = { jarra: RecurringJar; onChange: (v: RecurringJar) => void };

export function RecurringJarSelector({ jarra, onChange }: Props) {
  return (
    <View style={styles.block}>
      <Text style={styles.fieldLabel}>Jarra de pago</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segRow}>
        {JARRAS.map((j) => (
          <Pressable key={j.key} style={[styles.jarraItem, jarra === j.key && styles.jarraItemActive]} onPress={() => onChange(j.key)}>
            <MaterialIcons name={j.iconName} size={16} color={jarra === j.key ? colors.pureWhite : colors.slateGray} />
            <Text style={[styles.segText, jarra === j.key && styles.segTextActive]}>{j.label}</Text>
          </Pressable>
        ))}
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
  segText:         { ...typography.labelMd, color: colors.slateGray },
  segTextActive:   { color: colors.pureWhite },
});
