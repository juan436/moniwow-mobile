/**
 * JarItem — Component
 *
 * @what     Card-jarra para grid 2 columnas en Mis Jarras. Dentro de la card, un frasco de vidrio
 *           (`JarVessel`) se llena de monedas y billetes hasta el % de la meta. El emoji/ícono va
 *           como medallón overlay sobre el frasco.
 * @receives 2 props: jar, onPress?(jar)
 * @processes El relleno lo pinta `JarVessel` (SVG). El medallón se posiciona sobre el cuello del
 *           frasco (fracción fija del alto del viewBox). Chip Blindado + pill % arriba, saldo abajo.
 *           **`memo`**: cada vasija son ~250 nodos SVG; sin memo, abrir/cerrar un sheet en JarsScreen
 *           re-renderizaba las 8 cards enteras (lag al tocar). `onPress` recibe la jarra para que la
 *           referencia sea estable (nada de closure nueva por render que rompa el memo).
 * @returns  JSX — card flex:1 (top · vasija+medallón · saldo) compatible con FlatList numColumns={2}.
 * @props    2: jar, onPress?
 */
import { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { JarVessel } from './JarVessel';
import { JAR_GEO } from './jarFillModel';
import type { JarDisplay } from '../types';

const PCT_ALPHA = '26'; // ~15% — tinte del pill de porcentaje
const VESSEL_W = 104;
const VESSEL_H = (VESSEL_W * JAR_GEO.viewH) / JAR_GEO.viewW;
const MED = 44; // medallón del emoji
const MED_TOP = (VESSEL_H * 66) / JAR_GEO.viewH - MED / 2; // centro del cuello en el viewBox

type Props = { jar: JarDisplay; onPress?: (jar: JarDisplay) => void };

export const JarItem = memo(function JarItem({ jar, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, shadows.card, pressed && styles.pressed]} onPress={() => onPress?.(jar)}>
      <View style={styles.top}>
        <Text style={styles.name} numberOfLines={1}>{jar.name}</Text>
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

      <View style={styles.info}>
        <Text style={styles.balance}>$ {jar.balance.toLocaleString('es')}</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card:  { flex: 1, backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.cardPadding },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  top:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.stackSm },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs },
  name:  { ...typography.labelMd, color: colors.slateGray, flexShrink: 1 },
  pctPill: { paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXxs, borderRadius: radius.full },
  pctText: { ...typography.labelMdBold },
  vesselWrap: { height: VESSEL_H, alignItems: 'center', justifyContent: 'center', marginVertical: spacing.stackXs },
  medWrap:  { position: 'absolute', top: MED_TOP, left: 0, right: 0, alignItems: 'center' },
  medallion: { width: MED, height: MED, borderRadius: MED / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.pureWhite, borderWidth: 1, borderColor: colors.outlineVariant, ...shadows.card },
  emoji: { fontSize: sizes.emojiFontMd },
  info:  { alignItems: 'center' },
  balance: { ...typography.headlineMd, color: colors.navyDark },
});
