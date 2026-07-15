/**
 * LeakDetailScreen — Screen
 *
 * @what     Detalle de una fuga (gasto hormiga).
 * @receives id param de expo-router (fuga.id).
 * @processes Lee de `useAudit` (antes apuntaba a `useDashboard.fugas`, que ya no existe → la pantalla
 *           llevaba rota con 3 errores de tsc). **Hoy una fuga es UN gasto de Libre**, no una
 *           categoría con historial: por eso el hero muestra su fecha y NO dice "/mes", y la lista de
 *           movimientos solo aparece si hay desglose. El desglose por categoría ("café" = 20 cafés
 *           que suman $90) llega cuando la IA etiquete los gastos (M09).
 * @returns  JSX — Stack screen con back arrow y ScrollView sin anidamiento.
 */
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { useAudit } from '@features/audit/hooks/useAudit';

export function LeakDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fugas } = useAudit();
  const fuga = fugas.find((f) => f.id === id) ?? null;
  const insets = useSafeAreaInsets();

  function handleBack() { router.back(); }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color={colors.navyDark} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            {fuga?.name ?? 'Detalle de fuga'}
          </Text>
        </View>
        <View style={[styles.heroCard, shadows.card]}>
          <Text style={styles.heroLabel}>{fuga?.date ?? 'Gasto hormiga'}</Text>
          <Text style={styles.heroAmount}>-$ {fuga?.amount.toLocaleString('es')}</Text>
        </View>

        {(fuga?.items.length ?? 0) > 0 && (
          <>
            <Text style={styles.sectionLabel}>Movimientos</Text>
            {fuga?.items.map((tx) => (
              <View key={tx.description} style={[styles.txCard, shadows.card]}>
                <View style={styles.txLeft}>
                  <Text style={styles.txDesc}>{tx.description}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <Text style={styles.txAmount}>-$ {tx.amount.toLocaleString('es')}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom }]} />

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.stackMd,
    paddingRight: spacing.marginPage,
    paddingVertical: spacing.stackSm,
    gap: spacing.stackSm,
    backgroundColor: colors.pureWhite,
    marginHorizontal: -spacing.marginPage,
    ...shadows.card,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.headlineMd,
    color: colors.navyDark,
    flex: 1,
  },
  heroCard: {
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    alignItems: 'center',
    gap: spacing.stackXs,
  },
  heroLabel: { ...typography.labelMd, color: colors.slateGray },
  heroAmount: {
    ...typography.headlineLg,
    color: colors.alertOrange,
  },
  sectionLabel: {
    ...typography.bodyMdBold,
    color: colors.navyDark,
    marginTop: spacing.stackLg,
    marginBottom: spacing.stackSm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.marginPage,
    paddingBottom: spacing.stackLg,
    gap: spacing.stackSm,
  },
  footer: {
    backgroundColor: colors.pureWhite,
    ...shadows.footer,
  },
  txCard: {
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.stackMd,
  },
  txLeft: {
    flex: 1,
    gap: spacing.stackXs,
  },
  txDesc: {
    ...typography.bodyMd,
    color: colors.navyDark,
  },
  txDate: {
    ...typography.labelSm,
    color: colors.slateGray,
  },
  txAmount: {
    ...typography.labelMd,
    color: colors.alertOrange,
  },
});
