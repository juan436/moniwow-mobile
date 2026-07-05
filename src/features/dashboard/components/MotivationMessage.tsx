/**
 * MotivationMessage — Component
 *
 * @what     Mensaje motivacional sobre metas — una sola card que cambia de texto sola cada pocos
 *           segundos. Sin carrusel ni swipe (se descartó: no tenía sentido para un solo mensaje).
 * @receives 0 props
 * @processes Mensajes fijos, shuffle una sola vez al montar (useMemo). `setInterval` avanza el
 *           índice en loop; se limpia al desmontar. Mismo lenguaje visual que el hero card de
 *           MoniAI (accentBar goldDreams + iconRing) pero sin CTA — acá es solo aliento.
 * @returns  JSX — card con ícono + texto que rota solo.
 * @props    0
 */
import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';

const MESSAGES = [
  '¡Vamos bien con tus metas! Cada aporte te acerca más 🎯',
  'Ahorrar hoy es regalarte tranquilidad mañana ✨',
  'Un paso pequeño hoy, una meta cumplida mañana 🌱',
  'Tus metas están más cerca de lo que crees 💪',
  'La constancia es tu mejor aliada, sigue así 🚀',
  'Cada peso ahorrado cuenta una historia de progreso 📈',
];
const ROTATE_MS = 6000;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function MotivationMessage() {
  const messages = useMemo(() => shuffle(MESSAGES), []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.accentBar} />
      <View style={styles.iconRing}>
        <MaterialIcons name="emoji-events" size={22} color={colors.goldDreams} />
      </View>
      <Text style={styles.text}>{messages[index]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackMd,
    backgroundColor: colors.pureWhite, borderRadius: radius.card,
    padding: spacing.cardPadding, overflow: 'hidden',
  },
  accentBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: colors.goldDreams },
  iconRing: {
    width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full,
    backgroundColor: colors.goldDreams + '1A', borderWidth: 1, borderColor: colors.goldDreams + '33',
    alignItems: 'center', justifyContent: 'center',
  },
  text: { ...typography.labelMd, color: colors.slateGray, flex: 1, lineHeight: 20 },
});
