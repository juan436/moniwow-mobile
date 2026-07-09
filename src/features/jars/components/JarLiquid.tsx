/**
 * JarLiquid — Component
 *
 * @what     Capa de "líquido" compartida por las jarras (JarItem del grid + JarCard del dashboard):
 *           fuente única de verdad del llenado. Va como primer hijo absoluto de una card con
 *           `overflow: 'hidden'`; el contenido se pinta encima.
 * @receives 1 prop: jar
 * @processes Con meta (`progress` definido): nivel medido — se llena desde abajo hasta `progress%`
 *           con tinte `iconColor + FILL_ALPHA` + línea-superficie (`iconColor + SURFACE_ALPHA`).
 *           Sin meta (Libre/Fondo Seguridad/Metas): no hay % que llenar → "wash" (degradado SVG que
 *           se desvanece hacia arriba, sin nivel ni línea) — mantiene identidad de jarra sin fingir
 *           progreso. `id` del gradiente único por jarra para evitar colisión entre cards.
 * @returns  JSX — View absoluto (fill medido o wash SVG). `pointerEvents="none"`, no intercepta taps.
 * @props    1: jar
 */
import { View, StyleSheet } from 'react-native';
import { Svg, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

import type { JarDisplay } from '../types';

const FILL_ALPHA    = '26'; // ~15% — tinte de llenado suave (convención colors.*Tint)
const SURFACE_ALPHA = '59'; // ~35% — línea de superficie del líquido
const WASH_OPACITY  = 0.16; // wash de jarras sin meta (base, se desvanece a 0)

type Props = { jar: JarDisplay };

export function JarLiquid({ jar }: Props) {
  if (jar.progress !== undefined) {
    return (
      <View
        pointerEvents="none"
        style={[
          styles.fill,
          { height: `${jar.progress}%` as `${number}%`, backgroundColor: jar.iconColor + FILL_ALPHA, borderTopColor: jar.iconColor + SURFACE_ALPHA },
        ]}
      />
    );
  }

  const washId = `jarWash-${jar.id}`;
  return (
    <View style={styles.wash} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={washId} x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor={jar.iconColor} stopOpacity={WASH_OPACITY} />
            <Stop offset="0.6" stopColor={jar.iconColor} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${washId})`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 2 },
  wash: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
});
