/**
 * GoalsJarSheet — Component
 *
 * @what     Modal de la jarra Metas: header por extremos (izq emoji+nombre+blindado · der monto) y
 *           acceso a Mis Metas y Objetivos o a transferir de una meta puntual. Metas no es un pozo
 *           único, es la suma de metas — por eso "Transferir" primero manda a elegir de cuál.
 * @receives 2 props: item, onClose
 * @processes "Ir a Mis Metas y Objetivos" → /goals. "Transferir" → /goals-transfer. Ambos llaman
 *           onClose() antes de navegar (si no, el modal queda montado debajo y se siente lento).
 *           Navegación pura, sin importar features/goals/ — ver [[planes/psicologia-ux]].
 * @returns  JSX — sheet: header + 2 botones.
 * @props    2: item, onClose
 */
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { MoniButton, MoniSheet } from '@shared/components';
import type { JarDisplay } from '../types';

type Props = {
  item: JarDisplay | null;
  onClose: () => void;
};

export function GoalsJarSheet({ item, onClose }: Props) {
  const insets = useSafeAreaInsets();

  function handleGoToGoals() {
    onClose();
    router.push('/goals');
  }
  function handleGoToTransfer() {
    onClose();
    router.push('/goals-transfer');
  }

  return (
    <MoniSheet visible={item !== null} onClose={onClose}>
      <View style={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}>

          <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: item?.iconBg }]}>
              {item?.emoji
                ? <Text style={styles.emoji}>{item.emoji}</Text>
                : item?.iconName && <MaterialIcons name={item.iconName} size={20} color={item.iconColor} />
              }
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.jarName} numberOfLines={1}>{item?.name}</Text>
              {item?.isBlindado && (
                <View style={styles.chip}>
                  <MaterialIcons name="lock" size={12} color={colors.goldDreams} />
                  <Text style={styles.chipLabel}>Blindado</Text>
                </View>
              )}
            </View>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              $ {item?.balance.toLocaleString('es')}
            </Text>
          </View>

          <View style={styles.divider} />

          <MoniButton label="Ir a Mis Metas y Objetivos" onPress={handleGoToGoals} variant="secondary" />
          <MoniButton label="Transferir" onPress={handleGoToTransfer} />

      </View>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body:      { paddingHorizontal: spacing.cardPadding, paddingTop: spacing.stackSm, gap: spacing.stackMd },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  iconBox:   { width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  emoji:     { fontSize: sizes.emojiFontMd },
  headerInfo: { flex: 1, gap: spacing.stackXxs, alignItems: 'flex-start' },
  jarName:   { ...typography.bodyMdBold, color: colors.navyDark },
  chip:      { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXxs, paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXxs, borderRadius: radius.full, backgroundColor: colors.goldTint },
  chipLabel: { ...typography.labelXs, color: colors.goldDreams },
  amount:    { ...typography.headlineMd, color: colors.navyDark, flexShrink: 0 },
  divider:   { height: 1, backgroundColor: colors.surfaceContainerLow },
});
