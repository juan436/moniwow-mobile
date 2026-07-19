/**
 * ListMicButton — Component
 *
 * @what     Botón de dictado por voz de una lista. Vive en `ListSummaryBar`, con el mismo tratamiento
 *           circular que el cepillo de limpiar — los dos son acciones de la lista, se ven iguales.
 * @receives —
 * @processes Se gobierna solo: estado de grabación + loop de pulso radial adentro. Quien lo usa no
 *           tiene por qué saber si se está grabando. (Hoy solo anima — la captura de audio real no
 *           está implementada.)
 * @returns  JSX — botón circular con halo animado mientras graba.
 * @props    0
 */
import { useState, useCallback, useRef } from 'react';
import { Animated, View, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, spacing, radius } from '@shared/styles';

const MIC_SIZE = 36;

export function ListMicButton() {
  const [isRecording, setIsRecording] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

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

  return (
    <View style={styles.wrapper}>
      {isRecording && (
        <Animated.View style={[styles.pulse, {
          transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] }) }],
          opacity:            pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
        }]} />
      )}
      <Pressable style={[styles.btn, isRecording && styles.btnActive]} onPress={handleMic} hitSlop={8}>
        <MaterialIcons name="mic" size={20} color={isRecording ? colors.pureWhite : colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:   { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  pulse:     { position: 'absolute', width: MIC_SIZE, height: MIC_SIZE, borderRadius: MIC_SIZE / 2, backgroundColor: colors.emeraldSuccess },
  // Mismo tratamiento que el cepillo en ListSummaryBar: circular, surfaceContainerLow, padding 8.
  btn:       { padding: spacing.stackSm, backgroundColor: colors.surfaceContainerLow, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  btnActive: { backgroundColor: colors.emeraldSuccess },
});
