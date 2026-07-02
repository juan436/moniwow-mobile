/**
 * SacrificeSlider — Component
 *
 * @what     Slider "pesado" de confirmación: arrastrar hasta el final y mantener 3s para confirmar.
 * @receives 3 props: progress, onConfirm, disabled?
 * @processes Gesture.Pan + runOnJS(true) → Animated.Value (mismo patrón que ReceiptViewerModal, sin
 *           reanimated worklets, ver adr_gesture_handler). Al llegar a ≥85% del track arranca un
 *           timer de 3s (setTimeout, ya estamos en JS thread); soltar o retroceder lo cancela. La
 *           barra detrás del track se encoge en vivo según el arrastre (feedback visual del retroceso).
 * @returns  JSX — Track con barra de progreso encogible + thumb 🔥 arrastrable.
 * @props    3: progress, onConfirm, disabled?
 */
import { useMemo, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

import { colors, typography, spacing, radius } from '@shared/styles';

const THUMB_SIZE = 48;
const HOLD_MS = 3000;
const THRESHOLD = 0.85;

type Props = { progress: number; onConfirm: () => void; disabled?: boolean };

export function SacrificeSlider({ progress, onConfirm, disabled = false }: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const [dragFraction, setDragFraction] = useState(0);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const maxX = Math.max(1, trackWidth - THUMB_SIZE);

  function clearHold() {
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
  }

  function handleMove(x: number) {
    const clamped = Math.min(maxX, Math.max(0, x));
    translateX.setValue(clamped);
    setDragFraction(clamped / maxX);
    if (clamped / maxX >= THRESHOLD) {
      if (!holdTimer.current) holdTimer.current = setTimeout(onConfirm, HOLD_MS);
    } else {
      clearHold();
    }
  }

  function handleRelease() {
    clearHold();
    setDragFraction(0);
    Animated.timing(translateX, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  }

  const gesture = useMemo(() => Gesture.Pan()
    .runOnJS(true)
    .enabled(!disabled)
    .onUpdate((e) => handleMove(e.translationX))
    .onEnd(handleRelease),
    [maxX, disabled]
  );

  const shrunkPct = Math.max(0, progress - progress * dragFraction);

  return (
    <View style={styles.wrap}>
      <View style={styles.miniTrack}>
        <View style={[styles.miniFill, { width: `${shrunkPct}%` as `${number}%` }]} />
      </View>

      <View style={styles.track} onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.thumb, disabled && styles.thumbDisabled, { transform: [{ translateX }] }]}>
            <Text style={styles.thumbGlyph}>🔥</Text>
          </Animated.View>
        </GestureDetector>
      </View>
      <Text style={styles.hint}>{disabled ? 'Ingresá un monto válido' : 'Desliza y mantén para confirmar sacrificio'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:      { gap: spacing.stackSm },
  miniTrack: { height: 6, borderRadius: radius.full, backgroundColor: colors.surfaceContainerHigh, overflow: 'hidden' },
  miniFill:  { height: '100%', backgroundColor: colors.goldDreams, borderRadius: radius.full },
  track: {
    height: THUMB_SIZE, borderRadius: radius.full, backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center', paddingHorizontal: 2,
  },
  thumb: {
    width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: radius.full,
    backgroundColor: colors.alertOrange, alignItems: 'center', justifyContent: 'center',
  },
  thumbDisabled: { backgroundColor: colors.outlineVariant },
  thumbGlyph: { fontSize: 22 },
  hint: { ...typography.labelSm, color: colors.slateGray, textAlign: 'center' },
});
