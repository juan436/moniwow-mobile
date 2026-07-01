/**
 * AllocationJarNumpad — Component
 *
 * @what     Numpad propio para asignar el monto de UNA jarra (no dispara el teclado nativo).
 * @receives 5 props: jar, amount, onKey, onConfirm, onCancel
 * @processes Ninguno — delega la lógica de dígitos al hook.
 * @returns  JSX — header (volver + jarra) + AmountDisplay + NumpadGrid + botón Guardar.
 * @props    5: jar, amount, onKey, onConfirm, onCancel
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { AmountDisplay } from '../quick-add/AmountDisplay';
import { NumpadGrid } from '../quick-add/NumpadGrid';
import type { JarOption } from '../../types';

type Props = { jar: JarOption; amount: string; onKey: (key: string) => void; onConfirm: () => void; onCancel: () => void };

export function AllocationJarNumpad({ jar, amount, onKey, onConfirm, onCancel }: Props) {
  const insets = useSafeAreaInsets();

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

  btnWrap: { paddingHorizontal: spacing.marginPage },
  btn:     { height: spacing.buttonHeight, backgroundColor: colors.emeraldSuccess, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center' },
  btnText: { ...typography.labelMd, color: colors.pureWhite },
});
