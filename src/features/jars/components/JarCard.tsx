/**
 * JarCard — Component
 *
 * @what     Tarjeta de jarra para el scroll horizontal del dashboard. Mismo rediseño que `JarItem`:
 *           un frasco de vidrio (`JarVessel`) que se llena de monedas y billetes hasta el % de la meta.
 * @receives 2 props: jar, onPress?
 * @processes El relleno lo pinta `JarVessel` (SVG, fuente única con JarItem). Medallón overlay del
 *           emoji/ícono sobre el cuello. Chip Blindado + pill % arriba, saldo abajo.
 * @returns  JSX — card blanca width 200 (top · vasija+medallón · saldo).
 * @props    2: jar, onPress?
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import { JarVessel } from './JarVessel';
import { JAR_GEO } from './jarFillModel';
import type { JarDisplay } from '../types';

const PCT_ALPHA = '26'; // ~15% — tinte del pill de porcentaje
const VESSEL_W = 100;
const VESSEL_H = (VESSEL_W * JAR_GEO.viewH) / JAR_GEO.viewW;
const MED = 44;
const MED_TOP = (VESSEL_H * 66) / JAR_GEO.viewH - MED / 2;

type Props = { jar: JarDisplay; onPress?: () => void };

export function JarCard({ jar, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, shadows.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.top}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(jar.name, 18)}</Text>
        <View style={styles.topRight}>
          {jar.isBlindado && <MaterialIcons name="lock" size={18} color={colors.goldDreams} />}
          {jar.progress !== undefined && (
            <View style={[styles.pctPill, { backgroundColor: jar.iconColor + PCT_ALPHA }]}>
              <Text style={[styles.pctText, { color: jar.iconColor }]}>{jar.progress}%</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.vesselWrap}>
        <JarVessel jar={jar} width={VESSEL_W} />
        <View style={styles.medWrap} pointerEvents="none">
          <View style={styles.medallion}>
            {jar.emoji
              ? <Text style={styles.emoji}>{jar.emoji}</Text>
              : jar.iconName && <MaterialIcons name={jar.iconName} size={22} color={jar.iconColor} />}
          </View>
        </View>
      </View>

      <Text style={styles.balance}>$ {jar.balance.toFixed(2)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card:  { width: 200, backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.cardPadding },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  top:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.stackSm },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs },
  name:  { ...typography.labelMd, color: colors.slateGray, flexShrink: 1 },
  pctPill: { paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXxs, borderRadius: radius.full },
  pctText: { ...typography.labelMdBold },
  vesselWrap: { height: VESSEL_H, alignItems: 'center', justifyContent: 'center', marginVertical: spacing.stackSm },
  medWrap:  { position: 'absolute', top: MED_TOP, left: 0, right: 0, alignItems: 'center' },
  medallion: { width: MED, height: MED, borderRadius: MED / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.pureWhite, borderWidth: 1, borderColor: colors.outlineVariant, ...shadows.card },
  emoji: { fontSize: sizes.emojiFontMd },
  balance: { ...typography.headlineMd, color: colors.navyDark, textAlign: 'center' },
});
