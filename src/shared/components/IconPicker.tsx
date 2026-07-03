/**
 * IconPicker — Component
 *
 * @what     Grid de íconos MaterialIcons seleccionables para crear/editar una jarra.
 * @receives 2 props: value, onChange
 * @processes Grid scrolleable 6 columnas con los mismos íconos vectoriales que ya usan las jarras
 *           existentes (Hogar=home, Libre=account-balance-wallet, Viaje=flight, etc.) — antes el
 *           picker ofrecía emojis Unicode, inconsistentes con el estilo real de las jarras.
 * @returns  JSX — label + ScrollView con grid de íconos.
 * @props    2: value, onChange
 */
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { colors, typography, spacing, radius } from '../styles';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const ICON_SIZE = 48;
const ICON_GAP  = 8;

const JAR_ICONS: IconName[] = [
  'account-balance-wallet', 'home', 'security', 'savings', 'flight', 'favorite',
  'school', 'sports-esports', 'shopping-cart', 'shopping-bag', 'directions-bus', 'restaurant',
  'directions-car', 'pets', 'build',
];

type Props = { value: IconName | null; onChange: (icon: IconName) => void };

export function IconPicker({ value, onChange }: Props) {
  return (
    <View style={styles.block}>
      <Text style={styles.fieldLabel}>Elige un ícono</Text>
      <ScrollView style={styles.gridScroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={styles.grid}>
          {JAR_ICONS.map((icon) => (
            <Pressable
              key={icon}
              style={[styles.item, value === icon && styles.itemActive]}
              onPress={() => onChange(icon)}
            >
              <MaterialIcons name={icon} size={24} color={value === icon ? colors.emeraldSuccess : colors.slateGray} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block:      { gap: spacing.stackXs },
  fieldLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  gridScroll: { height: ICON_SIZE * 2 + ICON_GAP },
  grid:       { flexDirection: 'row', flexWrap: 'wrap', gap: ICON_GAP },
  item:       { width: ICON_SIZE, height: ICON_SIZE, borderRadius: radius.md, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  itemActive: { borderColor: colors.emeraldSuccess, backgroundColor: colors.emeraldTint },
});
