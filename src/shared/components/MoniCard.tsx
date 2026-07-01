/**
 * MoniCard — Component
 *
 * @what     Contenedor base de tarjeta del design system "Light Trust".
 * @receives 2 props: children (ReactNode), style? (ViewStyle)
 * @processes Aplica radius 32, sombra Navy, fondo blanco.
 * @returns  JSX — View estilizada como tarjeta.
 * @props    2: children, style?
 */
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadows } from '../styles';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function MoniCard({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: 24,
    ...shadows.card,
  },
});
