/**
 * AllocationJarNumpad — Component
 *
 * @what     Numpad propio para asignar el monto de UNA jarra (no dispara el teclado nativo).
 * @receives 2 props: data, actions (agrupados — jar+amount+maxAvailable + 4 handlers superaba 5)
 * @processes "Asignar todo" llena de un toque el disponible restante para esta jarra —
 *           acción explícita, nada se asigna solo.
 * @returns  JSX — header (volver + jarra) + AmountDisplay + NumpadGrid + Asignar todo + Guardar.
 * @props    2: data, actions
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { AmountDisplay } from '../quick-add/AmountDisplay';
import { NumpadGrid } from '../quick-add/NumpadGrid';
import type { JarOption } from '../../types';

type Data = { jar: JarOption; amount: string; maxAvailable: number };
type Actions = { onKey: (key: string) => void; onConfirm: () => void; onAssignAll: () => void; onCancel: () => void };
type Props = { data: Data; actions: Actions };

export function AllocationJarNumpad({ data, actions }: Props) {
  const insets = useSafeAreaInsets();
  const { jar, amount, maxAvailable } = data;
  const { onKey, onConfirm, onAssignAll, onCancel } = actions;
  const canAssignAll = maxAvailable > 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} hitSlop={12} onPress={onCancel}>
          <MaterialIcons name="arrow-back" size={22} color={colors.navyDark} />
        </Pressable>
        <View style={[styles.jarIcon, { backgroundColor: jar.iconBg }]}>
          <MaterialIcons name={jar.iconName} size={16} color={jar.iconColor} />
        </View>
        <Text style={styles.jarName} numberOfLines={1}>{jar.name}</Text>
      </View>

      <AmountDisplay amount={amount} label={`Monto para ${jar.name}`} />

      <Pressable
        style={[styles.assignAllChip, !canAssignAll && styles.assignAllChipDisabled]}
        onPress={onAssignAll}
        disabled={!canAssignAll}
        hitSlop={8}
      >
        <Text style={[styles.assignAllText, !canAssignAll && styles.assignAllTextDisabled]}>
          Asignar todo (${maxAvailable.toFixed(2)} disponibles)
        </Text>
      </Pressable>

      <NumpadGrid onKey={onKey} />

      <View style={[styles.btnWrap, { paddingBottom: insets.bottom + spacing.stackMd }]}>
        <Pressable style={styles.btn} onPress={onConfirm}>
          <Text style={styles.btnText}>Guardar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:    { gap: spacing.stackMd, paddingTop: spacing.stackSm },
  header:  { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm, paddingHorizontal: spacing.marginPage },
  backBtn: { width: sizes.avatarSm, height: sizes.avatarSm, alignItems: 'center', justifyContent: 'center' },
  jarIcon: { width: sizes.avatarSm, height: sizes.avatarSm, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  jarName: { ...typography.bodyMdBold, color: colors.navyDark, flex: 1 },

  assignAllChip: {
    alignSelf: 'center', paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackXs,
    borderRadius: radius.full, backgroundColor: colors.emeraldSuccess + '1A',
  },
  assignAllChipDisabled: { backgroundColor: colors.surfaceContainerHigh },
  assignAllText:         { ...typography.labelMd, color: colors.emeraldSuccess },
  assignAllTextDisabled: { color: colors.slateGray },

  btnWrap: { paddingHorizontal: spacing.marginPage },
  btn:     { height: spacing.buttonHeight, backgroundColor: colors.emeraldSuccess, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center' },
  btnText: { ...typography.labelMd, color: colors.pureWhite },
});
