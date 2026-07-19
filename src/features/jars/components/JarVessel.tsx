/**
 * JarVessel — Component
 *
 * @what     Frasco de vidrio SVG que se llena de monedas doradas (base densa) y billetes verdes
 *           (encima) hasta el nivel de la jarra.
 * @receives 2 props: jar, width
 * @processes El nivel = `progress/100` (o 0.24 si no hay meta: pila baja, sin nivel falso). El relleno
 *           llega de `buildJarFill` como **5 cadenas `d`, una por color** (FB-012): antes cada moneda
 *           eran 3 nodos y cada billete 5 → ~222 nodos por jarra, ~1.800 en pantalla. Todo lo que
 *           comparte fill/stroke se dibuja en un solo `Path`. Va clipeado al cuerpo del frasco. El
 *           emoji/ícono NO va acá — es un overlay RN (medallón) del contenedor.
 * @returns  JSX — Svg con relación de aspecto fija (JAR_GEO).
 * @props    2: jar, width
 */
import { memo } from 'react';
import { Svg, Defs, ClipPath, Rect, G, Path, Line, LinearGradient, Stop } from 'react-native-svg';

import { colors } from '@shared/styles';
import { buildJarFill, JAR_GEO } from './jarFillModel';
import type { JarDisplay } from '../types';

// Paleta de la ilustración (solo usada acá; el líquido viejo también definía sus tintes localmente).
const COIN_RIM = '#A97E2E';
const COIN_SHINE = '#F6E6AC';
const BILL = ['#2F9160', '#237A4C'];
const BILL_STROKE = '#0F3D28';

type Props = { jar: JarDisplay; width: number };

export const JarVessel = memo(function JarVessel({ jar, width }: Props) {
  const { viewW, viewH, body } = JAR_GEO;
  const level = jar.progress !== undefined ? jar.progress / 100 : 0.24;
  const fill = buildJarFill(jar.id, level);
  const cid = `jarClip-${jar.id}`;
  const gid = `coinG-${jar.id}`;
  const lidFill = jar.isBlindado ? jar.iconColor : colors.pureWhite;
  const lidStroke = jar.isBlindado ? jar.iconColor : colors.outlineVariant;

  return (
    <Svg width={width} height={(width * viewH) / viewW} viewBox={`0 0 ${viewW} ${viewH}`}>
      <Defs>
        <ClipPath id={cid}>
          <Rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.rx} />
        </ClipPath>
        {/* userSpaceOnUse: el degradado se mide contra el frasco, no contra cada trazo suelto. */}
        <LinearGradient id={gid} gradientUnits="userSpaceOnUse" x1={0} y1={body.y} x2={0} y2={body.y + body.h}>
          <Stop offset="0" stopColor="#F6E29A" />
          <Stop offset="0.5" stopColor="#DDB856" />
          <Stop offset="1" stopColor="#B8922F" />
        </LinearGradient>
      </Defs>

      {/* vidrio */}
      <Rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.rx} fill={colors.navyTint} stroke={colors.outlineVariant} strokeWidth={2} />

      <G clipPath={`url(#${cid})`}>
        <Path d={fill.coinsD} fill={`url(#${gid})`} stroke={COIN_RIM} strokeWidth={1} />
        <Path d={fill.shinesD} fill="none" stroke={COIN_SHINE} strokeOpacity={0.85} strokeWidth={1} />
        <Path d={fill.billsLightD} fill={BILL[0]} stroke={BILL_STROKE} strokeOpacity={0.4} />
        <Path d={fill.billsDarkD} fill={BILL[1]} stroke={BILL_STROKE} strokeOpacity={0.4} />
        <Path d={fill.billsInnerD} fill="none" stroke={colors.pureWhite} strokeOpacity={0.5} />
      </G>

      {/* contorno + cuello + tapa */}
      <Rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.rx} fill="none" stroke={colors.outlineVariant} strokeWidth={2} />
      <Rect x={42} y={24} width={56} height={12} rx={4} fill={colors.navyTint} stroke={colors.outlineVariant} strokeWidth={2} />
      <Rect x={38} y={8} width={64} height={18} rx={6} fill={lidFill} stroke={lidStroke} strokeWidth={2} />
      <Line x1={42} y1={17} x2={98} y2={17} stroke={jar.isBlindado ? colors.pureWhite : colors.outlineVariant} strokeOpacity={jar.isBlindado ? 0.6 : 1} strokeWidth={2} />
    </Svg>
  );
});
