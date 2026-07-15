/**
 * ProfileSheet — Component
 *
 * @what     Bottom sheet de perfil: avatar con iniciales, nombre/email/rol y menú de acciones mock.
 * @receives 4 props: visible, profile, onClose, onSignOut
 * @processes Menú estático (Editar perfil, Configuración, Ayuda) sin acción real — etapa mock.
 *           "Cerrar sesión" llama onSignOut. Chrome de sheet igual a TransferSheet.
 * @returns  JSX — bottom sheet slide-up con datos de usuario mock.
 * @props    4: visible, profile, onClose, onSignOut
 */
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { router, type Href } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import type { ProfileData } from '@shared/hooks/useProfile';

type MenuItem = { icon: keyof typeof MaterialIcons.glyphMap; label: string; route: Href };

const MENU: MenuItem[] = [
  { icon: 'edit', label: 'Editar perfil', route: '/edit-profile' },
  { icon: 'settings', label: 'Configuración', route: '/settings' },
  { icon: 'help-outline', label: 'Ayuda y soporte', route: '/help' },
];

type Props = {
  visible: boolean;
  profile: ProfileData;
  onClose: () => void;
  onSignOut: () => void;
};

export function ProfileSheet({ visible, profile, onClose, onSignOut }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.stackLg }]} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />

          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.initials}</Text>
            </View>
            <View style={styles.identityText}>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.email}>{profile.email}</Text>
              <View style={styles.rolePill}>
                <Text style={styles.roleText}>{profile.roleLabel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.menu}>
            {MENU.map((item) => (
              <Pressable key={item.label} style={styles.row} onPress={() => { onClose(); router.push(item.route); }}>
                <MaterialIcons name={item.icon} size={22} color={colors.slateGray} />
                <Text style={styles.rowLabel}>{item.label}</Text>
                <MaterialIcons name="chevron-right" size={22} color={colors.outlineVariant} />
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.signOut} onPress={onSignOut}>
            <MaterialIcons name="logout" size={22} color={colors.error} />
            <Text style={styles.signOutText}>Cerrar sesión</Text>
          </Pressable>
        </View>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:    { flex: 1, justifyContent: 'flex-end', backgroundColor: `${colors.navyDark}8C` },
  sheet:       { backgroundColor: colors.pureWhite, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card, paddingHorizontal: spacing.marginPage },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
  handle:      { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant, alignSelf: 'center', marginTop: spacing.stackSm, marginBottom: spacing.stackLg },
  identity:    { flexDirection: 'row', alignItems: 'center', gap: spacing.gutter, paddingBottom: spacing.stackLg, borderBottomWidth: 1, borderBottomColor: colors.dividerSoft },
  avatar:      { width: sizes.iconLg, height: sizes.iconLg, borderRadius: radius.full, backgroundColor: colors.emeraldSuccess, alignItems: 'center', justifyContent: 'center' },
  avatarText:  { ...typography.headlineMd, color: colors.pureWhite },
  identityText:{ flex: 1, gap: spacing.stackXxs },
  name:        { ...typography.headlineMd, color: colors.navyDark },
  email:       { ...typography.labelMd, color: colors.slateGray },
  rolePill:    { alignSelf: 'flex-start', marginTop: spacing.stackXs, paddingVertical: spacing.stackXxs, paddingHorizontal: spacing.stackSm, borderRadius: radius.full, backgroundColor: colors.emeraldTint },
  roleText:    { ...typography.labelSm, color: colors.emeraldSuccess },
  menu:        { paddingVertical: spacing.stackSm },
  row:         { flexDirection: 'row', alignItems: 'center', gap: spacing.gutter, paddingVertical: spacing.stackMd },
  rowLabel:    { ...typography.bodyMd, color: colors.onSurface, flex: 1 },
  signOut:     { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackMd, marginTop: spacing.stackSm, borderTopWidth: 1, borderTopColor: colors.dividerSoft },
  signOutText: { ...typography.bodyMdBold, color: colors.error },
});
