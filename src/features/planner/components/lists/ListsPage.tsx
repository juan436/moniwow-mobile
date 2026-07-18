/**
 * ListsPage — Component
 *
 * @what     Tab Listas: botón nueva lista + mic contextual + tarjetas de listas de compras.
 * @receives 3 props: listas, scrollY, topOffset
 * @processes Long press card → selección. Con lista seleccionada: mic (add por audio) + Limpiar
 *           (deschulea las casillas para reusar la lista). Tap mic → graba (loop pulso radial).
 * @returns  JSX — ScrollView vertical.
 * @props    3: listas, scrollY, topOffset
 */
import { useState, useCallback, useRef } from 'react';
import { Animated, View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniButton } from '@shared/components';
import { ListCard } from './ListCard';
import { CreateListSheet } from './CreateListSheet';
import { CreateItemSheet } from './CreateItemSheet';
import { useLists } from '../../hooks/useLists';

const MIC_SIZE = 36;

type Props = {
  scrollY: Animated.Value;
  topOffset: number;
};

export function ListsPage({ scrollY, topOffset }: Props) {
  const { listas, toggleItem, clearList }         = useLists();
  const [showAnadirLista, setShowAnadirLista]     = useState(false);
  const [itemTarget, setItemTarget]               = useState<{ listaId: string; listaName: string } | null>(null);
  const [selectedListaId, setSelectedListaId]     = useState<string | null>(null);
  const [isRecording, setIsRecording]             = useState(false);
  const pulseAnim                                 = useRef(new Animated.Value(0)).current;
  const loopRef                                   = useRef<Animated.CompositeAnimation | null>(null);

  const handleAnadir     = useCallback(() => setShowAnadirLista(true), []);
  const handleAddItem    = useCallback((listaId: string, listaName: string) => setItemTarget({ listaId, listaName }), []);
  const handleCloseLista = useCallback(() => setShowAnadirLista(false), []);
  const handleCloseItem  = useCallback(() => setItemTarget(null), []);

  const handleLongPress = useCallback((listaId: string) => {
    setSelectedListaId((prev) => prev === listaId ? null : listaId);
  }, []);

  const handleClear = useCallback(() => {
    if (selectedListaId !== null) clearList(selectedListaId);
  }, [selectedListaId, clearList]);

  const handleMic = useCallback(() => {
    if (isRecording) {
      loopRef.current?.stop();
      pulseAnim.setValue(0);
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const loop = Animated.loop(
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      );
      loopRef.current = loop;
      loop.start();
    }
  }, [isRecording, pulseAnim]);

  return (
    <>
      <Animated.ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: topOffset }]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        <View style={styles.actions}>
          <View style={styles.btnWrapper}>
            <MoniButton label="Añadir" onPress={handleAnadir} size="sm" />
          </View>
          {selectedListaId !== null && (
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
            <Pressable style={[styles.btnMic, (selectedListaId !== null || isRecording) && styles.btnMicActive]} onPress={handleMic} hitSlop={8}>
              <MaterialIcons name="mic" size={20} color={selectedListaId !== null || isRecording ? colors.pureWhite : colors.primary} />
            </Pressable>
          </View>
        </View>
        <View style={styles.list}>
          {listas.map((lista) => (
            <ListCard
              key={lista.id}
              lista={lista}
              onToggle={toggleItem}
              onAddItem={handleAddItem}
              isSelected={selectedListaId === lista.id}
              onLongPress={handleLongPress}
            />
          ))}
        </View>
      </Animated.ScrollView>

      <CreateListSheet visible={showAnadirLista} onClose={handleCloseLista} />
      <CreateItemSheet
        visible={!!itemTarget}
        listaId={itemTarget?.listaId ?? ''}
        listaName={itemTarget?.listaName ?? ''}
        onClose={handleCloseItem}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.stackLg, gap: spacing.stackSm },
  actions: {
    paddingTop: spacing.stackMd,
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackMd,
    paddingHorizontal: spacing.marginPage,
  },
  btnWrapper: { alignSelf: 'flex-start' },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs, paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXs, borderRadius: radius.button, borderWidth: 1, borderColor: colors.primary },
  clearText: { ...typography.labelSm, color: colors.primary },
  btnMic: {
    padding: spacing.stackSm,
    backgroundColor: colors.pureWhite, borderRadius: radius.button,
    alignItems: 'center', justifyContent: 'center',
  },
  btnMicActive: { backgroundColor: colors.emeraldSuccess },
  micWrapper:   { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  micPulse:     { position: 'absolute', width: MIC_SIZE, height: MIC_SIZE, borderRadius: MIC_SIZE / 2, backgroundColor: colors.emeraldSuccess },
  list: { paddingHorizontal: spacing.marginPage, gap: spacing.stackMd },
});
