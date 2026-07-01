/**
 * QuickAddStep2 — Component
 *
 * @what     Paso 2 Quick Add: selección de jarra + nota hormiga + botón CONFIRMAR.
 * @receives 3 props: selectedJar, onJarSelect, onConfirmar
 * @processes Muestra 3 jarras. Seleccionada tiene borde esmeralda + check. Default: Libre.
 * @returns  JSX — lista de JarOptionCard + nota 🐜 + botón CONFIRMAR.
 * @props    3: selectedJar, onJarSelect, onConfirmar
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import type { JarId } from '../../types';

type JarOption = { id: JarId; emoji: string; name: string; sub: string };

const JAR_OPTIONS: JarOption[] = [
  { id: 'hogar',  emoji: '🏠', name: 'Hogar',  sub: 'Gastos fijos y básicos' },
  { id: 'ahorro', emoji: '💎', name: 'Ahorro', sub: 'Metas y emergencias' },
  { id: 'libre',  emoji: '🍃', name: 'Libre',  sub: 'Ocio y gastos variables' },
];

type Props = {
  selectedJar: JarId;
  onJarSelect: (jar: JarId) => void;
  onConfirmar: () => void;
};

export function QuickAddStep2({ selectedJar, onJarSelect, onConfirmar }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.jarList}>
        {JAR_OPTIONS.map((jar) => {
          const isSelected = jar.id === selectedJar;
          return (
            <Pressable
              key={jar.id}
              style={[styles.jarCard, shadows.card, isSelected && styles.jarCardSelected]}
              onPress={() => onJarSelect(jar.id)}
            >
              <Text style={styles.jarEmoji}>{jar.emoji}</Text>
              <View style={styles.jarInfo}>
                <Text style={styles.jarName}>{jar.name}</Text>
                <Text style={styles.jarSub}>{jar.sub}</Text>
              </View>
              {isSelected && (
                <MaterialIcons name="check-circle" size={22} color={colors.emeraldSuccess} />
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hormigatNote}>Si cierras, se asigna a Libre 🐜</Text>

      <View style={styles.btnWrap}>
        <Pressable style={styles.btn} onPress={onConfirmar}>
          <Text style={styles.btnText}>Confirmar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:             { flex: 1, justifyContent: 'space-between', paddingBottom: spacing.stackLg },

  jarList:          { gap: spacing.stackMd, paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd },
  jarCard:          {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackMd,
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: spacing.stackLg,
    borderWidth: 2, borderColor: colors.transparent,
  },
  jarCardSelected:  { borderColor: colors.emeraldSuccess },
  jarEmoji:         { fontSize: 28 },
  jarInfo:          { flex: 1, gap: spacing.stackXs },
  jarName:          { ...typography.bodyMd, color: colors.navyDark },
  jarSub:           { ...typography.labelSm, color: colors.slateGray },

  hormigatNote:     { ...typography.labelSm, color: colors.slateGray, textAlign: 'center', paddingHorizontal: spacing.marginPage },

  btnWrap:          { paddingHorizontal: spacing.marginPage },
  btn:              { height: spacing.buttonHeight, backgroundColor: colors.emeraldSuccess, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center' },
  btnText:          { ...typography.labelMd, color: colors.pureWhite },
});
