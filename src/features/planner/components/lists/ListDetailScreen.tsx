/**
 * ListDetailScreen — Screen
 *
 * @what     Page única de una lista: header + progreso + checklist (con borrar ítem) + añadir ítem
 *           + mic (audio) + Limpiar. Es el detalle del master-detail; el índice (`ListsPage`) solo
 *           navega hasta acá.
 * @receives id param de expo-router (lista.id).
 * @processes `useLists` da el store compartido; busca la lista por id. Mic → loop de pulso radial
 *           (mismo patrón que tenía `ListsPage`). Limpiar deschulea; basura por fila borra el ítem.
 * @returns  JSX — pantalla con header, ScrollView de ítems, CreateItemSheet.
 */
import { useState, useCallback, useRef } from 'react';
import { Animated, View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { ListItem } from './ListItem';
import { CreateItemSheet } from './CreateItemSheet';
import { getBadgeColor } from './listBadge';
import { useLists } from '../../hooks/useLists';

const MIC_SIZE = 36;

export function ListDetailScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const insets   = useSafeAreaInsets();
  const { listas, toggleItem, clearList, deleteItem } = useLists();
  const lista    = listas.find((l) => l.id === id) ?? null;

  const [showAddItem, setShowAddItem] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const loopRef   = useRef<Animated.CompositeAnimation | null>(null);

  const handleClear    = useCallback(() => { if (id) clearList(id); }, [id, clearList]);
  const handleBack     = useCallback(() => router.back(), []);
  const handleOpenAdd  = useCallback(() => setShowAddItem(true), []);
  const handleCloseAdd = useCallback(() => setShowAddItem(false), []);
  const handleMic = useCallback(() => {
    if (isRecording) {
      loopRef.current?.stop();
      pulseAnim.setValue(0);
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const loop = Animated.loop(Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }));
      loopRef.current = loop;
      loop.start();
    }
  }, [isRecording, pulseAnim]);

  const done  = lista?.items.filter((i) => i.isChecked).length ?? 0;
  const total = lista?.items.length ?? 0;

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.stackSm }]}>
          <Pressable style={styles.backBtn} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color={colors.navyDark} />
          </Pressable>
          <Text style={styles.emoji}>{lista?.emoji}</Text>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{lista?.name ?? 'Lista'}</Text>
          {lista && (
            <View style={[styles.badge, { backgroundColor: getBadgeColor(lista.jarLabel) }]}>
              <Text style={styles.badgeLabel}>{lista.jarLabel}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Text style={styles.progress}>{done}/{total} comprados</Text>
          <View style={styles.actionsRight}>
            {total > 0 && (
              <Pressable style={styles.clearBtn} onPress={handleClear} hitSlop={8}>
                <MaterialIcons name="clear-all" size={18} color={colors.primary} />
                <Text style={styles.clearText}>Limpiar</Text>
              </Pressable>
            )}
            <View style={styles.micWrapper}>
              {isRecording && (
                <Animated.View style={[styles.micPulse, {
                  transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] }) }],
                  opacity:            pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
                }]} />
              )}
              <Pressable style={[styles.btnMic, isRecording && styles.btnMicActive]} onPress={handleMic} hitSlop={8}>
                <MaterialIcons name="mic" size={20} color={isRecording ? colors.pureWhite : colors.primary} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={[styles.card, shadows.card]}>
          {lista?.items.map((item) => (
            <ListItem key={item.id} item={item} listaId={lista.id} onToggle={toggleItem} onDelete={deleteItem} />
          ))}
          <Pressable style={styles.btnAddItem} onPress={handleOpenAdd} hitSlop={8}>
            <MaterialIcons name="add" size={18} color={colors.primary} />
            <Text style={styles.btnAddItemText}>Añadir ítem</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.statusBarCover, { height: insets.top }]} />

      <CreateItemSheet
        visible={showAddItem}
        listaId={lista?.id ?? ''}
        listaName={lista?.name ?? ''}
        onClose={handleCloseAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm,
    paddingLeft: spacing.stackMd, paddingRight: spacing.marginPage, paddingVertical: spacing.stackSm,
    backgroundColor: colors.pureWhite, marginHorizontal: -spacing.marginPage, ...shadows.card,
  },
  backBtn: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  emoji:       { fontSize: sizes.emojiFontMd },
  headerTitle: { ...typography.headlineMd, color: colors.navyDark, flex: 1 },
  badge:       { borderRadius: radius.sm, paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXs },
  badgeLabel:  { ...typography.labelXs, color: colors.pureWhite },
  list:        { flex: 1 },
  listContent: { paddingHorizontal: spacing.marginPage, paddingBottom: spacing.stackLg, gap: spacing.stackMd },
  actions:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.stackMd },
  actionsRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackMd },
  progress:    { ...typography.labelMd, color: colors.slateGray },
  clearBtn:    { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs, paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXs, borderRadius: radius.button, borderWidth: 1, borderColor: colors.primary },
  clearText:   { ...typography.labelSm, color: colors.primary },
  micWrapper:  { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  micPulse:    { position: 'absolute', width: MIC_SIZE, height: MIC_SIZE, borderRadius: MIC_SIZE / 2, backgroundColor: colors.emeraldSuccess },
  btnMic:      { padding: spacing.stackSm, backgroundColor: colors.pureWhite, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center' },
  btnMicActive: { backgroundColor: colors.emeraldSuccess },
  card: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl,
    padding: spacing.cardPadding, gap: spacing.stackSm,
    borderWidth: 1, borderColor: colors.surfaceContainerHighest,
  },
  btnAddItem:     { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs, paddingTop: spacing.stackSm, alignSelf: 'flex-start' },
  btnAddItemText: { ...typography.labelSm, color: colors.primary },
  statusBarCover: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: colors.pureWhite },
});
