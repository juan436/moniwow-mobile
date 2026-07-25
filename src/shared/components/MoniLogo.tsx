/**
 * MoniLogo — Component
 *
 * @what     Logo de MoniWow — mascota de monedas (isotipo), renderizado nativamente sin fondo.
 * @receives 3 props: width? (default 120), height? (default 82), variant? ('default' | 'light')
 * @processes Reemplaza el mark anterior (M-cartera) por la mascota nueva — fuente:
 *           `Logo de bosquejo/assets/moniwow-isotipo.svg` (fondo claro) y `moniwow-dark.svg` (fondo
 *           oscuro). El diseño ya trae los dos juegos de color — `variant="light"` no aclara el
 *           trazo, **recolorea la moneda grande y la cabeza a blanco** (así lo definió el archivo
 *           fuente, el dorado del medio queda igual en los dos). El `$` es texto SVG (2 glifos, no
 *           un path a mano) con la fuente de títulos ya cargada por la app (`Outfit_700Bold`).
 * @returns  JSX — Svg con relación de aspecto fija (viewBox 220×150), fondo transparente.
 * @props    3: width?, height?, variant?
 */
import Svg, { Circle, Ellipse, Path, Text as SvgText } from 'react-native-svg';

type Props = {
  width?: number;
  height?: number;
  variant?: 'default' | 'light';
};

const GOLD = '#e9b64a';

export function MoniLogo({ width = 120, height = 82, variant = 'default' }: Props) {
  const isLight = variant === 'light';
  const green = isLight ? '#ffffff' : '#0f9d58';
  const dot = isLight ? '#0c2318' : '#0a2e1c';
  const dollarOnGreen = isLight ? '#0c2318' : '#ffffff';

  return (
    <Svg viewBox="0 0 220 150" width={width} height={height} preserveAspectRatio="xMidYMid meet">
      <Ellipse cx={176} cy={42} rx={30} ry={26} fill={green} />
      <Circle cx={185} cy={34} r={5} fill={dot} />
      <Path d="M170 20 L162 4 M158 4 L162 4 L162 12" stroke={green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" />

      <Circle cx={120} cy={70} r={34} fill={GOLD} />
      <SvgText x={120} y={82} fontFamily="Outfit_700Bold" fontSize={34} fill="#ffffff" textAnchor="middle">$</SvgText>

      <Circle cx={52} cy={80} r={48} fill={green} />
      <SvgText x={52} y={97} fontFamily="Outfit_700Bold" fontSize={46} fill={dollarOnGreen} textAnchor="middle">$</SvgText>

      <Path d="M40 122 L30 145 M30 145 L18 145" stroke={green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M70 122 L80 140 M80 140 L92 140" stroke={green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M108 100 L100 122 M100 122 L90 122" stroke={GOLD} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M138 100 L146 118 M146 118 L156 118" stroke={GOLD} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}
