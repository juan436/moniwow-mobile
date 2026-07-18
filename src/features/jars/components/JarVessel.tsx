/**
 * JarVessel — Component
 *
 * @what     Frasco de vidrio SVG que se llena de monedas doradas (base densa) y billetes verdes
 *           (encima) hasta el nivel de la jarra. Reemplaza el tinte plano de `JarLiquid`.
 * @receives 2 props: jar, width
 * @processes El nivel = `progress/100` (o 0.24 si no hay meta: pila baja, sin nivel falso). Las
 *           posiciones las da `buildJarFill` (puro, sembrado por `jar.id`). Todo va clipeado al
 *           cuerpo del frasco. El emoji/ícono NO va acá — es un overlay RN (medallón) del contenedor.
 * @returns  JSX — Svg con relación de aspecto fija (JAR_GEO).
 * @props    2: jar, width
 */
import { Svg, Defs, ClipPath, Rect, G, Ellipse, Line, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { colors } from '@shared/styles';
import { buildJarFill, JAR_GEO } from './jarFillModel';
import type { JarDisplay } from '../types';

// Paleta de la ilustración (solo usada acá; el líquido viejo también definía sus tintes localmente).
const COIN_RIM = '#A97E2E';
const COIN_SHINE = '#F6E6AC';
const BILL = ['#2F9160', '#237A4C'];
const BILL_STROKE = '#0F3D28';

type Props = { jar: JarDisplay; width: number };

export function JarVessel({ jar, width }: Props) {
  const { viewW, viewH, body } = JAR_GEO;
  const level = jar.progress !== undefined ? jar.progress / 100 : 0.24;
  const { coins, bills } = buildJarFill(jar.id, level);
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
        <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F6E29A" />
          <Stop offset="0.5" stopColor="#DDB856" />
          <Stop offset="1" stopColor="#B8922F" />
        </LinearGradient>
      </Defs>

      {/* vidrio */}
      <Rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.rx} fill={colors.navyTint} stroke={colors.outlineVariant} strokeWidth={2} />

      <G clipPath={`url(#${cid})`}>
        {coins.map((c, i) => (
          <G key={`c${i}`}>
            <Ellipse cx={c.cx} cy={c.cy} rx={9} ry={6.2} fill={`url(#${gid})`} stroke={COIN_RIM} strokeWidth={1} />
            <Ellipse cx={c.cx} cy={c.cy} rx={5.5} ry={3.4} fill="none" stroke={COIN_SHINE} strokeOpacity={0.85} strokeWidth={1} />
          </G>
        ))}
        {bills.map((b, i) => (
          <G key={`b${i}`} x={b.x} y={b.y}>
            <G rotation={b.rot}>
              <Rect x={-19} y={-9.5} width={38} height={19} rx={3} fill={b.dark ? BILL[1] : BILL[0]} stroke={BILL_STROKE} strokeOpacity={0.4} />
              <Rect x={-15} y={-6} width={30} height={12} rx={2} fill="none" stroke={colors.pureWhite} strokeOpacity={0.5} />
              <SvgText x={0} y={3.2} fontSize={9} fontWeight="800" fill={colors.pureWhite} fillOpacity={0.9} textAnchor="middle">$</SvgText>
            </G>
          </G>
        ))}
      </G>

      {/* contorno + cuello + tapa */}
      <Rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.rx} fill="none" stroke={colors.outlineVariant} strokeWidth={2} />
      <Rect x={42} y={24} width={56} height={12} rx={4} fill={colors.navyTint} stroke={colors.outlineVariant} strokeWidth={2} />
      <Rect x={38} y={8} width={64} height={18} rx={6} fill={lidFill} stroke={lidStroke} strokeWidth={2} />
      <Line x1={42} y1={17} x2={98} y2={17} stroke={jar.isBlindado ? colors.pureWhite : colors.outlineVariant} strokeOpacity={jar.isBlindado ? 0.6 : 1} strokeWidth={2} />
    </Svg>
  );
}
