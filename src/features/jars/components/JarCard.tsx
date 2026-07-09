/**
 * JarCard — Component
 *
 * @what     Tarjeta de jarra para scroll horizontal del dashboard. Mismo rediseño que JarItem del
 *           grid: la card ES la jarra — se llena con `JarLiquid` (nivel medido con meta · wash sin meta).
 * @receives 2 props: jar, onPress?
 * @processes El líquido lo pinta `JarLiquid` (fuente única, compartida con JarItem). `overflow: hidden`
 *           lo recorta a las esquinas. Con meta muestra pill de % (tinte de la jarra) arriba junto al
 *           ícono, al lado del badge Blindado; monto destacado abajo. Misma jerarquía que JarItem.
 * @returns  JSX — card blanca width 200 (JarLiquid + contenido).
 * @props    2: jar, onPress?
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import { JarLiquid } from './JarLiquid';
import type { JarDisplay } from '../types';

const PCT_ALPHA = '26'; // ~15% — tinte pill de porcentaje (misma convención que JarItem/JarLiquid)

type Props = {
  jar: JarDisplay;
  onPress?: () => void;
};

export function JarCard({ jar, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <JarLiquid jar={jar} />
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: jar.iconBg }]}>
          <MaterialIcons name={jar.iconName} size={22} color={jar.iconColor} />
        </View>
        <View style={styles.topRight}>
          {jar.isBlindado && (
            <View style={styles.blindadoBadge}>
              <Text style={styles.blindadoText}>Blindado</Text>
            </View>
          )}
          {jar.progress !== undefined && (
            <View style={[styles.pctPill, { backgroundColor: jar.iconColor + PCT_ALPHA }]}>
              <Text style={[styles.pctText, { color: jar.iconColor }]}>{jar.progress}%</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(jar.name, 18)}</Text>
      <Text style={styles.balance}>$ {jar.balance.toFixed(2)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    overflow: 'hidden',
    ...shadows.card,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.stackMd,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackXs,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blindadoBadge: {
    paddingHorizontal: spacing.stackMd,
    paddingVertical: 4,
    backgroundColor: colors.goldDreams,
    borderRadius: radius.full,
  },
  blindadoText: {
    ...typography.labelSm,
    color: colors.pureWhite,
  },
  pctPill: {
    paddingHorizontal: spacing.stackSm,
    paddingVertical: spacing.stackXxs,
    borderRadius: radius.full,
  },
  pctText: {
    ...typography.labelMdBold,
  },
  name: {
    ...typography.labelMd,
    color: colors.slateGray,
    marginBottom: spacing.stackXs,
  },
  balance: {
    ...typography.headlineMd,
    color: colors.navyDark,
  },
});
