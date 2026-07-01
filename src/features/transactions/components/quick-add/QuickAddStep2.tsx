/**
 * QuickAddStep2 — Component
 *
 * @what     Paso 2 Quick Add: carrusel de jarras (origen del gasto) + botón CONFIRMAR.
 * @receives 4 props: jars, selectedJar, onJarSelect, onConfirmar
 * @processes Jarras reales del workspace (M03: 3 base + N personalizadas), no una lista fija.
 *           Selección instantánea al tocar una fila — no hace falta numpad, el monto ya viene
 *           del Paso 1 y acá solo se elige DE QUÉ jarra sale.
 * @returns  JSX — JarSelectCarousel + botón CONFIRMAR.
 * @props    4: jars, selectedJar, onJarSelect, onConfirmar
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { JarSelectCarousel } from './JarSelectCarousel';
import type { JarOption } from '../../types';

type Props = {
  jars: JarOption[];
  selectedJar: string;
  onJarSelect: (jarId: string) => void;
  onConfirmar: () => void;
};

export function QuickAddStep2({ jars, selectedJar, onJarSelect, onConfirmar }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrap}>
      <View style={styles.body}>
        <JarSelectCarousel jars={jars} selectedJar={selectedJar} onSelectJar={onJarSelect} />
      </View>

      <View style={[styles.btnWrap, { paddingBottom: insets.bottom + spacing.stackLg }]}>
        <Pressable style={styles.btn} onPress={onConfirmar}>
          <Text style={styles.btnText}>Confirmar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'space-between' },
  body: { gap: spacing.stackMd, paddingTop: spacing.stackMd },

  btnWrap: { paddingHorizontal: spacing.marginPage },
  btn:     { height: spacing.buttonHeight, backgroundColor: colors.emeraldSuccess, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center' },
  btnText: { ...typography.labelMd, color: colors.pureWhite },
});
