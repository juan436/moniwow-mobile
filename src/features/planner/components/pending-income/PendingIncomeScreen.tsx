/**
 * PendingIncomeScreen — Screen
 *
 * @what     Ingresos cuya fecha ya pasó y siguen sin marcar. Se confirman desde aquí.
 * @receives 1 prop: onJarsChanged?
 * @processes Gemela de `/overdue`, pero al revés: no es deuda, es un **recordatorio** de que quizá
 *           se te olvidó marcar que un ingreso llegó. Por eso verde, no naranja. La lista se DERIVA
 *           (`buildAgenda.toConfirm`): ingresos `pending` con fecha pasada y sin confirmar. Confirmar
 *           escribe el ingreso en el libro (mismo `¡Llegó!` que en Mi Mes) y la fila desaparece sola.
 * @returns  JSX — header + resumen verde + FlatList de ingresos por confirmar (o estado vacío).
 */
import { useCallback } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { usePlanner } from '@features/planner/hooks/usePlanner';
import { useConfirmFlow } from '@features/planner/hooks/useConfirmFlow';
import { PlannerItem } from '@features/planner/components/shared/PlannerItem';
import { ConfirmItemSheet } from '@features/planner/components/my-month/ConfirmItemSheet';
import type { AgendaItemDisplay } from '@features/planner/types';

function keyExtractor(item: AgendaItemDisplay) { return item.id; }

type Props = { onJarsChanged?: () => void };

export function PendingIncomeScreen({ onJarsChanged }: Props) {
  const { toConfirm, onConfirmItem, error } = usePlanner(onJarsChanged);
  const { asking, ask, confirm, cancel } = useConfirmFlow(toConfirm, onConfirmItem);
  const insets = useSafeAreaInsets();

  const total = toConfirm.reduce((sum, item) => sum + item.amount, 0);

  const renderItem = useCallback(
    ({ item }: { item: AgendaItemDisplay }) => (
      <View style={styles.itemWrap}>
        <Text style={styles.dayTag}>Debió llegar el día {item.day}</Text>
        <PlannerItem item={item} onAction={ask} />
      </View>
    ),
    [ask],
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.stackSm }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.navyDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Por confirmar</Text>
      </View>

      {error !== null && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={toConfirm}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + spacing.stackLg }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          toConfirm.length > 0 ? (
            <View style={styles.summary}>
              <MaterialIcons name="schedule" size={22} color={colors.emeraldSuccess} />
              <Text style={styles.summaryLabel}>Esperando tu confirmación</Text>
              <Text style={styles.summaryTotal}>$ {total.toLocaleString('es')}</Text>
              <Text style={styles.summaryHint}>Marca ¡Llegó! cuando el dinero entre</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="check-circle" size={40} color={colors.emeraldSuccess} />
            <Text style={styles.emptyText}>Todos tus ingresos están al día.</Text>
          </View>
        }
      />

      <ConfirmItemSheet item={asking} onConfirm={confirm} onCancel={cancel} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm,
    paddingHorizontal: spacing.stackMd, paddingBottom: spacing.stackSm,
    backgroundColor: colors.pureWhite, ...shadows.card,
  },
  backBtn: {
    width: sizes.iconMd, height: sizes.iconMd, borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { ...typography.headlineMd, color: colors.navyDark, flex: 1 },
  error:       { ...typography.labelSm, color: colors.alertOrange, margin: spacing.marginPage },
  listContent: { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackSm },
  summary: {
    alignItems: 'center', gap: spacing.stackXs,
    backgroundColor: colors.emeraldSuccess + '14', borderRadius: radius.card,
    paddingVertical: spacing.stackLg, marginBottom: spacing.stackSm,
  },
  summaryLabel: { ...typography.labelMd, color: colors.slateGray },
  summaryTotal: { ...typography.headlineLg, color: colors.emeraldSuccess },
  summaryHint:  { ...typography.labelSm, color: colors.slateGray },
  itemWrap:     { gap: spacing.stackXs, marginBottom: spacing.stackSm },
  dayTag:       { ...typography.labelSm, color: colors.slateGray, marginLeft: spacing.stackMd },
  empty:        { alignItems: 'center', gap: spacing.stackMd, paddingTop: spacing.stackLg },
  emptyText:    { ...typography.bodyMd, color: colors.slateGray, textAlign: 'center' },
});
