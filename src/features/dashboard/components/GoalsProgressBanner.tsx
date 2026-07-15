/**
 * GoalsProgressBanner — Component
 *
 * @what     Banner "Progreso Total de Metas" en el dashboard — versión compacta de la card hero
 *           de GoalsSummaryPage (Revisión → Mis Sueños), con botón que lleva ahí directo.
 * @receives 3 props: goalProgress, goalsTotal, metaGlobal
 * @processes Mismo lenguaje visual que GoalsSummaryPage (barra de progreso emeraldSuccess) para
 *           que se sienta la misma sección, no una distinta — sin el accentBar superior de esa
 *           página, acá se ve demasiado cargado junto al resto del dashboard. Navega a
 *           `/review?page=goals` — AuditScreen lee ese param y salta a la página de Mis Sueños.
 * @returns  JSX — card con título, %, barra y botón "Ver detalle".
 * @props    3: goalProgress, goalsTotal, metaGlobal
 */
import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';

type Props = { goalProgress: number; goalsTotal: number; metaGlobal: number };

function handleViewDetail() { router.push('/review?page=goals'); }

export function GoalsProgressBanner({ goalProgress, goalsTotal, metaGlobal }: Props) {
  const fillStyle = useMemo(() => [styles.fill, { width: `${goalProgress}%` as `${number}%` }], [goalProgress]);

  return (
    <Pressable style={[styles.card, shadows.card]} onPress={handleViewDetail}>
      <View style={styles.header}>
        <Text style={styles.title}>Progreso Total de Metas</Text>
        <Text style={styles.pct}>{goalProgress}%</Text>
      </View>
      <View style={styles.track}>
        <View style={fillStyle} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>$ {goalsTotal.toLocaleString('es')} de $ {metaGlobal.toLocaleString('es')}</Text>
        <View style={styles.link}>
          <Text style={styles.linkText}>Ver detalle</Text>
          <MaterialIcons name="chevron-right" size={16} color={colors.emeraldSuccess} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.stackSm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  title:  { ...typography.bodyMdBold, color: colors.navyDark },
  pct:    { ...typography.bodyLg, color: colors.emeraldSuccess },
  track:  { height: sizes.trackMd, backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full, overflow: 'hidden' },
  fill:   { height: '100%', backgroundColor: colors.emeraldSuccess, borderRadius: radius.full },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { ...typography.labelSm, color: colors.slateGray },
  link:       { flexDirection: 'row', alignItems: 'center' },
  linkText:   { ...typography.labelMdBold, color: colors.emeraldSuccess },
});
