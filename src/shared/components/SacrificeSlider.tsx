/**
 * SacrificeSlider — Component
 *
 * @what     Slider "pesado" de confirmación: arrastrar hasta el final y mantener 3s para confirmar.
 *           Compartido — cualquier jarra Blindado lo usa al transferir (antes exclusivo de Metas).
 * @receives 3 props: progress, onConfirm, disabled?
 * @processes Gesture.Pan + runOnJS(true) → Animated.Value (mismo patrón que ReceiptViewerModal, sin
 *           reanimated worklets, ver adr_gesture_handler). Al llegar a ≥85% del track arranca un
 *           timer de 3s (setTimeout, ya estamos en JS thread); soltar o retroceder lo cancela. La
 *           barra detrás del track se encoge en vivo según el arrastre (feedback visual del retroceso).
 *           Al cruzar el umbral arranca también un setInterval de 100ms que calcula segundos
 *           restantes desde un timestamp — el thumb muestra la cuenta regresiva (3→2→1) en vez del
 *           🔥, y el hint refuerza el mismo número. Sin este contador, soltar antes de los 3s
 *           parecía un bug (el slider solo rebotaba a 0, sin explicación). El hint mantiene alto
 *           constante entre estados (disabled/idle/holding) sin trucos de píxeles: los 3 textos
 *           llevan `\n` explícito para ocupar siempre exactamente 2 filas (`numberOfLines={2}`),
 *           así el alto natural no cambia al alternar el texto y el modal contenedor no se redimensiona.
 * @returns  JSX — Track con barra de progreso encogible + thumb 🔥 arrastrable.
 * @props    3: progress, onConfirm, disabled?
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

import { colors, typography, spacing, radius } from '../styles';

const THUMB_SIZE = 48;
const HOLD_MS = 3000;
const THRESHOLD = 0.85;
const MINI_TRACK_HEIGHT = 6;
const HINT_LINES = 2;

type Props = { progress: number; onConfirm: () => void; disabled?: boolean };

export function SacrificeSlider({ progress, onConfirm, disabled = false }: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const [dragFraction, setDragFraction] = useState(0);
  const [holdMsLeft, setHoldMsLeft] = useState(HOLD_MS);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxX = Math.max(1, trackWidth - THUMB_SIZE);

  function clearHold() {
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
    if (holdInterval.current) { clearInterval(holdInterval.current); holdInterval.current = null; }
    setHoldMsLeft(HOLD_MS);
  }

  function startHold() {
    const startedAt = Date.now();
    holdTimer.current = setTimeout(onConfirm, HOLD_MS);
    holdInterval.current = setInterval(() => {
      setHoldMsLeft(Math.max(0, HOLD_MS - (Date.now() - startedAt)));
    }, 100);
  }

  function handleMove(x: number) {
    const clamped = Math.min(maxX, Math.max(0, x));
    translateX.setValue(clamped);
    setDragFraction(clamped / maxX);
    if (clamped / maxX >= THRESHOLD) {
      if (!holdTimer.current) startHold();
    } else {
      clearHold();
    }
  }

  function handleRelease() {
    clearHold();
    setDragFraction(0);
    Animated.timing(translateX, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  }

  useEffect(() => clearHold, []);

  const gesture = useMemo(() => Gesture.Pan()
    .runOnJS(true)
    .enabled(!disabled)
    .onUpdate((e) => handleMove(e.translationX))
    .onEnd(handleRelease),
    [maxX, disabled]
  );

  const shrunkPct = Math.max(0, progress - progress * dragFraction);
  const isHolding = dragFraction >= THRESHOLD;
  const holdSeconds = Math.ceil(holdMsLeft / 1000);
  const hintText = disabled
    ? 'Ingresá un monto\nválido para continuar'
    : isHolding
      ? `Mantén presionado sin soltar…\nfaltan ${holdSeconds} segundos`
      : 'Desliza hasta el final y mantén\n3 segundos para confirmar';

  return (
    <View style={styles.wrap}>
      <View style={styles.miniTrack}>
        <View style={[styles.miniFill, { width: `${shrunkPct}%` as `${number}%` }]} />
      </View>

      <View style={styles.track} onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.thumb, disabled && styles.thumbDisabled, { transform: [{ translateX }] }]}>
            <Text style={styles.thumbGlyph}>{isHolding ? holdSeconds : '🔥'}</Text>
          </Animated.View>
        </GestureDetector>
      </View>
      <Text style={[styles.hint, isHolding && styles.hintHolding]} numberOfLines={HINT_LINES}>{hintText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:      { gap: spacing.stackSm },
  miniTrack: { height: MINI_TRACK_HEIGHT, borderRadius: radius.full, backgroundColor: colors.surfaceContainerHigh, overflow: 'hidden' },
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
  hintHolding: { color: colors.alertOrange },
});
