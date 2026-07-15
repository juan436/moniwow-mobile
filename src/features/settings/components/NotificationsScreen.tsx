/**
 * NotificationsScreen — Screen
 *
 * @what     Pantalla completa de notificaciones con scroll nativo (FlatList §9).
 * @receives —
 * @processes Datos de useNotifications (mock). No leídas resaltadas (emeraldTint + dot). "Marcar
 *           todas leídas" en cabecera de lista si hay pendientes. Estado vacío. Reemplaza al
 *           antiguo NotificationsSheet (bottom sheet no escalaba con muchos ítems).
 * @returns  JSX — header + FlatList de notificaciones.
 */
import { useCallback } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { ScreenHeader } from '@shared/components';
import { useNotifications, type NotificationItem } from '@shared/hooks/useNotifications';

function keyExtractor(item: NotificationItem) { return item.id; }

export function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { notifications, unreadCount, markAllRead } = useNotifications();

  const renderItem = useCallback(
    ({ item }: { item: NotificationItem }) => (
      <View style={[styles.row, !item.isRead && styles.rowUnread]}>
        <View style={[styles.iconWrap, { backgroundColor: item.tint + '1A' }]}>
          <MaterialIcons name={item.icon} size={20} color={item.tint} />
        </View>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowBody}>{item.body}</Text>
          <Text style={styles.rowTime}>{item.time}</Text>
        </View>
        {!item.isRead && <View style={styles.dot} />}
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
        ListHeaderComponent={
          unreadCount > 0 ? (
            <Pressable style={styles.markAll} onPress={markAllRead} hitSlop={8}>
              <MaterialIcons name="done-all" size={16} color={colors.emeraldSuccess} />
              <Text style={styles.markAllText}>Marcar todas como leídas</Text>
            </Pressable>
          ) : null
        }
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
  markAll:     { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs, alignSelf: 'flex-end', paddingBottom: spacing.stackSm },
  markAllText: { ...typography.labelMd, color: colors.emeraldSuccess },
  row:         { flexDirection: 'row', alignItems: 'center', gap: spacing.gutter, padding: spacing.cardPadding, borderRadius: radius.lg, backgroundColor: colors.surfaceContainerLow },
  rowUnread:   { backgroundColor: colors.emeraldTint },
  iconWrap:    { width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  rowText:     { flex: 1, gap: spacing.stackXxs },
  rowTitle:    { ...typography.bodyMdBold, color: colors.navyDark },
  rowBody:     { ...typography.labelMd, color: colors.onSurfaceVariant },
  rowTime:     { ...typography.labelSm, color: colors.slateGray },
  dot:         { width: sizes.dotSm, height: sizes.dotSm, borderRadius: radius.full, backgroundColor: colors.emeraldSuccess },
  empty:       { alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackLg },
  emptyText:   { ...typography.bodyMd, color: colors.slateGray },
});
