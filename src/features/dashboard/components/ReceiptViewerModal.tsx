/**
 * ReceiptViewerModal — Component
 *
 * @what     Lightbox fullscreen para visualizar factura. Pinch-to-zoom y pan con 1 dedo.
 * @receives 3 props: uri, visible, onClose
 * @processes Gesture.Simultaneous(Pinch, Pan) vía gesture-handler. Animated.Value en JS thread.
 * @returns  JSX — Modal fullscreen negro con imagen zoomeable y botón X.
 * @props    3: uri, visible, onClose
 */
import { useRef, useCallback, useMemo } from 'react';
import { Modal, View, Image, Pressable, StyleSheet, Animated } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@shared/styles';

type Props = { uri: string; visible: boolean; onClose: () => void };

const MIN_SCALE = 1;
const MAX_SCALE = 4;

export function ReceiptViewerModal({ uri, visible, onClose }: Props) {
  const insets = useSafeAreaInsets();

  const scale      = useRef(new Animated.Value(1)).current;
  const transX     = useRef(new Animated.Value(0)).current;
  const transY     = useRef(new Animated.Value(0)).current;
  const savedScale = useRef(1);
  const savedX     = useRef(0);
  const savedY     = useRef(0);

  const gesture = useMemo(() => {
    const pinch = Gesture.Pinch()
      .runOnJS(true)
      .onUpdate((e) => {
        scale.setValue(Math.min(MAX_SCALE, Math.max(MIN_SCALE, savedScale.current * e.scale)));
      })
      .onEnd((e) => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, savedScale.current * e.scale));
        savedScale.current = next;
        if (next <= MIN_SCALE) {
          savedScale.current = 1; savedX.current = 0; savedY.current = 0;
          scale.setValue(1); transX.setValue(0); transY.setValue(0);
        }
      });

    const pan = Gesture.Pan()
      .runOnJS(true)
      .minPointers(1)
      .maxPointers(1)
      .onUpdate((e) => {
        if (savedScale.current <= 1) return;
        transX.setValue(savedX.current + e.translationX);
        transY.setValue(savedY.current + e.translationY);
      })
      .onEnd((e) => {
        if (savedScale.current <= 1) return;
        savedX.current += e.translationX;
        savedY.current += e.translationY;
      });

    return Gesture.Simultaneous(pinch, pan);
  }, [scale, transX, transY]);

  const handleClose = useCallback(() => {
    scale.setValue(1); transX.setValue(0); transY.setValue(0);
    savedScale.current = 1; savedX.current = 0; savedY.current = 0;
    onClose();
  }, [onClose, scale, transX, transY]);

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={handleClose} statusBarTranslucent>
      <GestureHandlerRootView style={styles.screen}>
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[styles.imageWrap, {
              transform: [{ translateX: transX }, { translateY: transY }, { scale }],
            }]}
          >
            <Image source={{ uri }} style={styles.image} resizeMode="contain" />
          </Animated.View>
        </GestureDetector>

        <Pressable style={[styles.closeBtn, { top: insets.top + 8 }]} onPress={handleClose} hitSlop={12}>
          <MaterialIcons name="close" size={22} color={colors.pureWhite} />
        </Pressable>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: colors.black },
  imageWrap: { flex: 1 },
  image:     { flex: 1, width: '100%' },
  closeBtn:  { position: 'absolute', right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: `${colors.black}80`, alignItems: 'center', justifyContent: 'center' },
});
