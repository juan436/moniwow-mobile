/**
 * JarItem — Component
 *
 * @what     Card-jarra para grid 2 columnas en pantalla Mis Jarras. La tarjeta ES la jarra: su fondo
 *           se llena desde abajo con el tinte de la jarra hasta el % de progreso (metáfora de líquido,
 *           mismo lenguaje que el track de fuego del SacrificeSlider).
 * @receives 2 props: jar, onPress?
 * @processes El líquido (nivel medido con meta · wash SVG sin meta) lo pinta `JarLiquid` compartido,
 *           como primer hijo absoluto. `overflow: hidden` lo recorta a las esquinas redondeadas.
 * @returns  JSX — card flex:1 (JarLiquid + contenido) compatible con FlatList numColumns={2}.
 * @props    2: jar, onPress?
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { JarLiquid } from './JarLiquid';
import type { JarDisplay } from '../types';

const PCT_ALPHA = '26'; // ~15% — tinte pill de porcentaje (misma convención que JarLiquid/colors.*Tint)

type Props = { jar: JarDisplay; onPress?: () => void };

export function JarItem({ jar, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, shadows.card, pressed && styles.pressed]} onPress={onPress}>
      <JarLiquid jar={jar} />
      <View style={styles.top}>
        <View style={[styles.icon, { backgroundColor: jar.iconBg }]}>
          {jar.emoji
            ? <Text style={styles.emoji}>{jar.emoji}</Text>
            : jar.iconName && <MaterialIcons name={jar.iconName} size={22} color={jar.iconColor} />
          }
        </View>
        <View style={styles.topRight}>
          {jar.isBlindado && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Blindado</Text>
            </View>
          )}
          {jar.progress !== undefined && (
            <View style={[styles.pctPill, { backgroundColor: jar.iconColor + PCT_ALPHA }]}>
              <Text style={[styles.pctText, { color: jar.iconColor }]}>{jar.progress}%</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{jar.name}</Text>
        <Text style={styles.balance}>$ {jar.balance.toLocaleString('es')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card:  { flex: 1, backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.cardPadding, overflow: 'hidden' },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  top:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs },
  info:  { marginTop: spacing.stackSm, gap: spacing.stackXxs },
  icon:  { width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: sizes.emojiFontMd },
  badge: { paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXxs, backgroundColor: colors.goldTint, borderRadius: radius.full },
  badgeText: { ...typography.labelXs, color: colors.goldDreams },
  pctPill: { paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXxs, borderRadius: radius.full },
  pctText: { ...typography.labelMdBold },
  name:    { ...typography.labelMd, color: colors.slateGray },
  balance: { ...typography.headlineMd, color: colors.navyDark },
});
