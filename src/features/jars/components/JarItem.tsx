/**
 * JarItem — Component
 *
 * @what     Card de jarra para grid 2 columnas en pantalla Mis Jarras.
 * @receives 1 prop: jar
 * @processes Muestra icono o emoji (jarras creadas por el usuario), nombre, saldo, barra de
 *           progreso y badge Blindado.
 * @returns  JSX — card flex:1 compatible con FlatList numColumns={2}.
 * @props    1: jar
 */
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import type { JarDisplay } from '../types';

type Props = { jar: JarDisplay };

export function JarItem({ jar }: Props) {
  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.top}>
        <View style={[styles.icon, { backgroundColor: jar.iconBg }]}>
          {jar.emoji
            ? <Text style={styles.emoji}>{jar.emoji}</Text>
            : jar.iconName && <MaterialIcons name={jar.iconName} size={22} color={jar.iconColor} />
          }
        </View>
        {jar.isBlindado && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Blindado</Text>
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>{jar.name}</Text>
      <Text style={styles.balance}>$ {jar.balance.toLocaleString('es')}</Text>
      {jar.progress !== undefined && (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${jar.progress}%` as `${number}%`, backgroundColor: jar.iconColor }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card:  { flex: 1, backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.stackSm },
  top:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  icon:  { width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: sizes.emojiFontMd },
  badge: { paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXxs, backgroundColor: colors.goldTint, borderRadius: radius.full },
  badgeText: { ...typography.labelXs, color: colors.goldDreams },
  name:    { ...typography.labelMd, color: colors.slateGray },
  balance: { ...typography.bodyMdBold, color: colors.navyDark },
  track: { height: sizes.trackXs, backgroundColor: colors.surfaceContainer, borderRadius: radius.full, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: radius.full },
});
