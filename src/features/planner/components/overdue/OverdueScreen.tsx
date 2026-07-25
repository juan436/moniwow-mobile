/**
 * OverdueScreen — Screen
 *
 * @what     Lo que se pasó de fecha y sigue sin pagar, en DOS bloques: pagos sueltos y deudas.
 * @receives 1 prop: onJarsChanged?
 * @processes **Un gasto atrasado no es una deuda atrasada.** El pago es único del mes (renta, Netflix);
 *           la cuota es parte de una deuda mayor que se acumula y mueve la barra de Revisión. Van en
 *           secciones separadas, con ícono y subtotal. El dato ya los distingue: la cuota trae
 *           `cuotaMonth` (por eso lleva la etiqueta del mes; el pago no la necesita, la card ya dice
 *           su día). Nada guardado: sale de `buildAgenda.overdue` (calendario − libro).
 * @returns  JSX — header + resumen + SectionList de dos secciones (o estado vacío).
 */
import { useCallback, useMemo } from 'react';
import { View, Text, Pressable, SectionList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { usePlanner } from '@features/planner/hooks/usePlanner';
import { useConfirmFlow } from '@features/planner/hooks/useConfirmFlow';
import { PlannerItem } from '@features/planner/components/shared/PlannerItem';
import { ConfirmItemSheet } from '@features/planner/components/my-month/ConfirmItemSheet';
import type { AgendaItemDisplay } from '@features/planner/types';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof MaterialIcons>['name'];
type Section  = { title: string; subtotal: number; icon: IconName; data: AgendaItemDisplay[] };

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] as const;

function keyExtractor(item: AgendaItemDisplay) { return item.id; }
function sum(items: AgendaItemDisplay[]) { return items.reduce((s, i) => s + i.amount, 0); }
function monthLabel(m: string) { const [y, mm] = m.split('-'); return `${MESES[Number(mm) - 1]} ${y}`; }

type Props = { onJarsChanged?: () => void };

export function OverdueScreen({ onJarsChanged }: Props) {
  const { overdue, onConfirmItem, error } = usePlanner(onJarsChanged);
  const { asking, ask, confirm, cancel } = useConfirmFlow(overdue, onConfirmItem);
  const insets = useSafeAreaInsets();

  const sections = useMemo<Section[]>(() => {
    const pagos  = overdue.filter((i) => !i.cuotaMonth);
    const cuotas = overdue.filter((i) => i.cuotaMonth);
    return [
      { title: 'Pagos atrasados',  subtotal: sum(pagos),  icon: 'receipt-long' as IconName, data: pagos },
      { title: 'Deudas atrasadas', subtotal: sum(cuotas), icon: 'credit-card' as IconName,  data: cuotas },
    ].filter((s) => s.data.length > 0);
  }, [overdue]);

  const total = sum(overdue);

  const renderItem = useCallback(
    ({ item }: { item: AgendaItemDisplay }) => (
      <View style={styles.itemWrap}>
        {item.cuotaMonth && <Text style={styles.monthTag}>Cuota de {monthLabel(item.cuotaMonth)}</Text>}
        <PlannerItem item={item} onAction={ask} />
      </View>
    ),
    [ask],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: Section }) => (
      <View style={styles.sectionHeader}>
        <MaterialIcons name={section.icon} size={18} color={colors.slateGray} />
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionSubtotal}>$ {section.subtotal.toLocaleString('es')}</Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.stackSm }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.navyDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Atrasados</Text>
      </View>

      {error !== null && <Text style={styles.error}>{error}</Text>}

      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + spacing.stackLg }]}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          overdue.length > 0 ? (
            <View style={styles.summary}>
              <MaterialIcons name="warning-amber" size={22} color={colors.alertOrange} />
              <Text style={styles.summaryLabel}>Vencido y sin pagar</Text>
              <Text style={styles.summaryTotal}>$ {total.toLocaleString('es')}</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="check-circle" size={40} color={colors.emeraldSuccess} />
            <Text style={styles.emptyText}>Nada vencido. Vas al día con tus pagos y deudas.</Text>
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
    backgroundColor: colors.alertOrange + '14', borderRadius: radius.card,
    paddingVertical: spacing.stackLg, marginBottom: spacing.stackSm,
  },
  summaryLabel: { ...typography.labelMd, color: colors.slateGray },
  summaryTotal: { ...typography.headlineLg, color: colors.alertOrange },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm,
    marginTop: spacing.stackMd, marginBottom: spacing.stackXs,
  },
  sectionTitle:    { ...typography.labelMdBold, color: colors.navyDark, flex: 1 },
  sectionSubtotal: { ...typography.labelMdBold, color: colors.alertOrange },
  itemWrap:        { gap: spacing.stackXs, marginBottom: spacing.stackSm },
  monthTag:        { ...typography.labelSm, color: colors.slateGray, marginLeft: spacing.stackMd },
  empty:           { alignItems: 'center', gap: spacing.stackMd, paddingTop: spacing.stackLg },
  emptyText:       { ...typography.bodyMd, color: colors.slateGray, textAlign: 'center' },
});
