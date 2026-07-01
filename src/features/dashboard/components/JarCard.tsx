/**
 * JarCard — Component
 *
 * @what     Tarjeta de jarra para scroll horizontal del dashboard.
 * @receives 2 props: jar, onPress?
 * @processes Muestra ícono, saldo, barra de progreso y badge Blindado según tipo.
 * @returns  JSX — card blanca radius-32 min-width 200.
 * @props    2: jar, onPress?
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import type { JarDisplay } from '../../types';

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
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: jar.iconBg }]}>
          <MaterialIcons name={jar.iconName} size={22} color={jar.iconColor} />
        </View>
        {jar.isBlindado && (
          <View style={styles.blindadoBadge}>
            <Text style={styles.blindadoText}>Blindado</Text>
          </View>
        )}
        {jar.progress !== undefined && !jar.isBlindado && (
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>{jar.progress}%</Text>
          </View>
        )}
      </View>

      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(jar.name, 18)}</Text>
      <Text style={styles.balance}>$ {jar.balance.toFixed(2)}</Text>

      {jar.progress !== undefined && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${jar.progress}%`, backgroundColor: jar.iconColor }]} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.stackMd,
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
  progressBadge: {
    paddingHorizontal: spacing.stackMd,
    paddingVertical: 4,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
  },
  progressBadgeText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  name: {
    ...typography.labelMd,
    color: colors.slateGray,
    marginBottom: 4,
  },
  balance: {
    ...typography.bodyLg,
    color: colors.onBackground,
    marginBottom: spacing.stackMd,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
