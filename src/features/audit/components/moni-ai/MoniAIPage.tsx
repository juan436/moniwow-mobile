/**
 * MoniAIPage — Component
 *
 * @what     Página MoniAI del carrusel Revisión: asistente IA financiero.
 * @receives 3 props: indicator, scrollY, topOffset
 * @processes Hero card goldDreams (accentBar) + insight + CTA + stats card blanca.
 * @returns  JSX — ScrollView con 2 cards blancas. Fondo heredado del screen.
 * @props    3: indicator, scrollY, topOffset
 */
import { View, Text, Animated, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { PageIndicator } from '@shared/components';

type Indicator = { count: number; active: number };
type Props = { indicator: Indicator; scrollY: Animated.Value; topOffset: number };

const INSIGHT = 'Gastas $200/mes en delivery. Reducirlo un 50% libera $100 para tu Carro Honda.';

function handleChatPress() {}

export function MoniAIPage({ indicator, scrollY, topOffset }: Props) {
  return (
    <Animated.ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: topOffset }]}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      scrollEventThrottle={16}
    >
      <PageIndicator count={indicator.count} active={indicator.active} />

      <View style={[styles.card, styles.heroCard, shadows.card]}>
        <View style={styles.accentBar} />

        <View style={styles.avatarRow}>
          <View style={styles.iconRing}>
            <MaterialIcons name="psychology" size={26} color={colors.goldDreams} />
          </View>
          <View style={styles.nameBlock}>
            <Text style={styles.aiName}>MoniAI</Text>
            <Text style={styles.aiSub}>Análisis financiero inteligente</Text>
          </View>
          <MaterialIcons name="auto-awesome" size={20} color={colors.goldDreams} />
        </View>

        <View style={styles.divider} />

        <View style={styles.insightRow}>
          <Text style={styles.insightText}>{INSIGHT}</Text>
        </View>

        <Pressable style={styles.cta} onPress={handleChatPress}>
          <MaterialIcons name="chat-bubble-outline" size={16} color={colors.pureWhite} />
          <Text style={styles.ctaText}>Hablar con MoniAI</Text>
        </Pressable>
      </View>

      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardLabel}>Resumen del mes</Text>

        <View style={styles.statRow}>
          <View style={[styles.statIcon, styles.statIconGreen]}>
            <MaterialIcons name="pie-chart" size={18} color={colors.emeraldSuccess} />
          </View>
          <Text style={styles.statLabel}>Presupuesto usado</Text>
          <Text style={[styles.statValue, styles.statGreen]}>73%</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statRow}>
          <View style={[styles.statIcon, styles.statIconOrange]}>
            <MaterialIcons name="warning" size={18} color={colors.alertOrange} />
          </View>
          <Text style={styles.statLabel}>Fugas detectadas</Text>
          <Text style={[styles.statValue, styles.statOrange]}>6</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statRow}>
          <View style={[styles.statIcon, styles.statIconGold]}>
            <MaterialIcons name="star" size={18} color={colors.goldDreams} />
          </View>
          <Text style={styles.statLabel}>Metas activas</Text>
          <Text style={[styles.statValue, styles.statGold]}>6</Text>
        </View>
      </View>

    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:   { flex: 1 },
  content:  { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackSm, paddingBottom: spacing.stackLg, gap: spacing.stackMd },

  card:      { backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.stackSm },
  heroCard:  { overflow: 'hidden' },
  accentBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: colors.goldDreams },

  avatarRow:   { flexDirection: 'row', alignItems: 'center', gap: spacing.stackMd, paddingTop: spacing.stackXs },
  iconRing:    { width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full, backgroundColor: colors.goldDreams + '1A', borderWidth: 1, borderColor: colors.goldDreams + '33', alignItems: 'center', justifyContent: 'center' },
  nameBlock:   { flex: 1, gap: spacing.stackXxs },
  aiName:      { ...typography.bodyMdBold, color: colors.navyDark },
  aiSub:       { ...typography.labelXs, color: colors.slateGray },
  divider:     { height: 1, backgroundColor: colors.surfaceContainerHigh },

  insightRow:  { flexDirection: 'row' },
  insightText: { ...typography.labelMd, color: colors.slateGray, flex: 1, lineHeight: 20 },

  cta:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.stackSm, backgroundColor: colors.navyDark, borderRadius: radius.full, paddingVertical: spacing.stackMd },
  ctaText: { ...typography.labelMdBold, color: colors.pureWhite },

  cardLabel:    { ...typography.bodyMdBold, color: colors.navyDark },
  statRow:      { flexDirection: 'row', alignItems: 'center', gap: spacing.stackMd, paddingVertical: spacing.stackSm },
  statDivider:  { height: 1, backgroundColor: colors.surfaceContainerHigh },
  statIcon:     { width: 36, height: 36, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  statIconGreen:  { backgroundColor: colors.emeraldSuccess + '1A' },
  statIconOrange: { backgroundColor: colors.alertOrange + '1A' },
  statIconGold:   { backgroundColor: colors.goldDreams + '1A' },
  statLabel:    { ...typography.bodyMd, color: colors.navyDark, flex: 1 },
  statValue:    { ...typography.bodyMdBold },
  statGreen:    { color: colors.emeraldSuccess },
  statOrange:   { color: colors.alertOrange },
  statGold:     { color: colors.goldDreams },
});
