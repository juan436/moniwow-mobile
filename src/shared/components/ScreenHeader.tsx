/**
 * ScreenHeader — Component
 *
 * @what     Encabezado fijo de pantalla apilada: botón atrás (router.back) + título.
 * @receives 1 prop: title
 * @processes Aplica inset superior (safe area) y fondo blanco con sombra. Reutilizable por
 *           cualquier pantalla push (editar-perfil, configuración, ayuda).
 * @returns  JSX — barra superior con back + título.
 * @props    1: title
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';

type Props = { title: string };

export function ScreenHeader({ title }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.stackSm }]}>
      <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
        <MaterialIcons name="arrow-back" size={24} color={colors.navyDark} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm,
    paddingLeft: spacing.stackMd, paddingRight: spacing.marginPage, paddingBottom: spacing.stackSm,
    backgroundColor: colors.pureWhite, ...shadows.card,
  },
  backBtn: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.headlineMd, color: colors.navyDark, flex: 1 },
});
