/**
 * AppTopBar — Component
 *
 * @what     TopAppBar genérico: logo + notificaciones + avatar. Maneja status bar inset.
 * @receives —
 * @processes Usa useSafeAreaInsets para paddingTop dinámico según dispositivo.
 * @returns  JSX — barra superior reutilizable por cualquier feature (excepto auth).
 * @props    0
 */
import { View, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MoniLogo } from './MoniLogo';
import { colors, spacing, radius, sizes } from '@shared/styles';

export function AppTopBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: insets.top + spacing.stackSm }]}>
      <MoniLogo width={80} height={44} />
      <View style={styles.actions}>
        <Pressable style={styles.iconButton} hitSlop={sizes.dotSm}>
          <MaterialIcons name="notifications" size={24} color={colors.emeraldSuccess} />
          <View style={styles.badge} />
        </Pressable>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={18} color={colors.slateGray} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.marginPage,
    paddingBottom: spacing.stackSm,
    backgroundColor: colors.pureWhite,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  iconButton: { padding: spacing.stackSm, borderRadius: radius.full, position: 'relative' },
  badge: {
    position: 'absolute', top: spacing.stackSm, right: spacing.stackSm,
    width: sizes.dotSm, height: sizes.dotSm, borderRadius: radius.full,
    backgroundColor: colors.error,
    borderWidth: 1.5, borderColor: colors.pureWhite,
  },
  avatar: {
    width: sizes.avatarSm, height: sizes.avatarSm, borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: colors.outlineVariant,
  },
});
