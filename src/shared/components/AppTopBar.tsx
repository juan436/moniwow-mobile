/**
 * AppTopBar — Component
 *
 * @what     TopAppBar genérico: logo + notificaciones + avatar. Maneja status bar inset.
 * @receives —
 * @processes Usa useSafeAreaInsets para paddingTop dinámico según dispositivo. Campanita y avatar
 *           abren bottom sheets (NotificationsSheet / ProfileSheet) con datos mock de hooks.
 *           Badge visible solo si hay notificaciones sin leer. Avatar muestra iniciales del perfil.
 * @returns  JSX — barra superior reutilizable por cualquier feature (excepto auth).
 * @props    0
 */
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MoniLogo } from './MoniLogo';
import { ProfileSheet } from './ProfileSheet';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useProfile } from '@shared/hooks/useProfile';
import { colors, typography, spacing, radius, sizes } from '@shared/styles';

export function AppTopBar() {
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();
  const { profile } = useProfile();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <View style={[styles.bar, { paddingTop: insets.top + spacing.stackSm }]}>
      <MoniLogo width={80} height={44} />
      <View style={styles.actions}>
        <Pressable style={styles.iconButton} hitSlop={sizes.dotSm} onPress={() => router.push('/notifications')}>
          <MaterialIcons name="notifications" size={24} color={colors.emeraldSuccess} />
          {unreadCount > 0 && <View style={styles.badge} />}
        </Pressable>
        <Pressable style={styles.avatar} hitSlop={sizes.dotSm} onPress={() => setProfileOpen(true)}>
          <Text style={styles.avatarText}>{profile.initials}</Text>
        </Pressable>
      </View>

      <ProfileSheet
        visible={profileOpen}
        profile={profile}
        onClose={() => setProfileOpen(false)}
        onSignOut={() => setProfileOpen(false)}
      />
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
    backgroundColor: colors.emeraldSuccess,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { ...typography.labelMdBold, color: colors.pureWhite },
});
