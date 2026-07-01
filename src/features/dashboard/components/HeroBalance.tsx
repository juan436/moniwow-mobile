/**
 * HeroBalance — Component
 *
 * @what     Card hero con Saldo Libre, botón + y subtexto. Barra accent top esmeralda.
 * @receives 2 props: balance, onAddPress
 * @processes Formatea monto con 2 decimales.
 * @returns  JSX — card blanca radius-32 con accent bar y contenido centrado.
 * @props    2: balance, onAddPress
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';

type Props = {
  balance: number;
  onAddPress: () => void;
};

export function HeroBalance({ balance, onAddPress }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />

      <Text style={styles.label}>Saldo libre</Text>

      <View style={styles.amountRow}>
        <Text style={styles.amount}>$ {balance.toFixed(2)}</Text>
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          onPress={onAddPress}
          hitSlop={8}
        >
          <MaterialIcons name="add" size={22} color={colors.pureWhite} />
        </Pressable>
      </View>

      <Text style={styles.subtitle}>Esto es lo que puedes gastar hoy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    alignItems: 'center',
    overflow: 'hidden',
    ...shadows.card,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: colors.emeraldSuccess,
  },
  label: {
    ...typography.labelMd,
    color: colors.slateGray,
    marginTop: spacing.stackSm,
    marginBottom: spacing.stackSm,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutter,
    marginBottom: spacing.stackSm,
  },
  amount: {
    ...typography.headlineLg,
    color: colors.navyDark,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.emeraldSuccess,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPressed: {
    transform: [{ scale: 0.9 }],
  },
  subtitle: {
    ...typography.labelMd,
    color: colors.slateGray,
  },
});
