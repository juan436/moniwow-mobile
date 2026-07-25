/**
 * NotificationsScreen — Screen
 *
 * @what     Pantalla completa de notificaciones con scroll nativo (FlatList §9).
 * @receives —
 * @processes Datos de `useNotifications` (FB-020, real: pagos próximos + metas cerca del objetivo).
 *           Sin distinción leído/no-leído — son alertas vigentes, no un historial de mensajes (ver
 *           docblock de la hook). Reemplaza al antiguo NotificationsSheet (bottom sheet no escalaba
 *           con muchos ítems).
 * @returns  JSX — header + FlatList de notificaciones.
 */
import { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { ScreenHeader } from '@shared/components';
import { useNotifications, type NotificationItem } from '@shared/hooks/useNotifications';

function keyExtractor(item: NotificationItem) { return item.id; }

export function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { notifications } = useNotifications();

  const renderItem = useCallback(
    ({ item }: { item: NotificationItem }) => (
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: item.tint + '1A' }]}>
          <MaterialIcons name={item.icon} size={20} color={item.tint} />
        </View>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowBody}>{item.body}</Text>
        </View>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Notificaciones" />
      <FlatList
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + spacing.stackLg }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="notifications-none" size={40} color={colors.outlineVariant} />
            <Text style={styles.emptyText}>Sin notificaciones por ahora.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.background },
  list:        { flex: 1 },
  listContent: { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackSm },
  row:         { flexDirection: 'row', alignItems: 'center', gap: spacing.gutter, padding: spacing.cardPadding, borderRadius: radius.lg, backgroundColor: colors.surfaceContainerLow },
  iconWrap:    { width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  rowText:     { flex: 1, gap: spacing.stackXxs },
  rowTitle:    { ...typography.bodyMdBold, color: colors.navyDark },
  rowBody:     { ...typography.labelMd, color: colors.onSurfaceVariant },
  empty:       { alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackLg },
  emptyText:   { ...typography.bodyMd, color: colors.slateGray },
});
