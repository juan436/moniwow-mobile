/**
 * GoalsHeader — Component
 *
 * @what     Header de GoalsScreen: flecha de back + título "Mis sueños".
 * @receives 1 prop: topInset
 * @processes Se llega a GoalsScreen empujando desde la jarra Ahorro (push) — no es tab raíz, por
 *           eso usa back en vez de AppTopBar.
 * @returns  JSX — Row con backBtn + título.
 * @props    1: topInset
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';

function handleBack() { router.back(); }

type Props = { topInset: number };

export function GoalsHeader({ topInset }: Props) {
  return (
    <View style={[styles.header, { paddingTop: topInset + spacing.stackSm }]}>
      <Pressable style={styles.backBtn} onPress={handleBack}>
        <MaterialIcons name="arrow-back" size={24} color={colors.navyDark} />
      </Pressable>
      <Text style={styles.headerTitle}>Mis sueños</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm,
    paddingHorizontal: spacing.marginPage, paddingBottom: spacing.stackSm,
    backgroundColor: colors.pureWhite,
  },
  backBtn: {
    width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { ...typography.headlineMd, color: colors.navyDark },
});
