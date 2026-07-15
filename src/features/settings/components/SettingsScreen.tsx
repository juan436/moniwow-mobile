/**
 * SettingsScreen — Screen
 *
 * @what     Ajustes básicos V1: switches de notificaciones/recordatorios/modo oscuro + moneda.
 * @receives —
 * @processes Estado local por switch (mock, sin persistencia ni efecto real aún). Uso personal —
 *           sin opciones de cuenta/privacidad comerciales. Moneda es fila informativa.
 * @returns  JSX — header + secciones con filas conmutables.
 */
import { useState } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { ScreenHeader } from '@shared/components';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [notifs, setNotifs]       = useState(true);
  const [reminders, setReminders] = useState(true);
  const [darkMode, setDarkMode]   = useState(false);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Configuración" />
      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.section}>Preferencias</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Notificaciones</Text>
            <Switch value={notifs} onValueChange={setNotifs} trackColor={{ true: colors.emeraldSuccess, false: colors.outlineVariant }} thumbColor={colors.pureWhite} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Recordatorios de pagos</Text>
            <Switch value={reminders} onValueChange={setReminders} trackColor={{ true: colors.emeraldSuccess, false: colors.outlineVariant }} thumbColor={colors.pureWhite} />
          </View>
        </View>

        <Text style={styles.section}>Apariencia</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Modo oscuro</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: colors.emeraldSuccess, false: colors.outlineVariant }} thumbColor={colors.pureWhite} />
          </View>
        </View>

        <Text style={styles.section}>General</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Moneda</Text>
            <Text style={styles.rowValue}>Dólar · $</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: colors.background },
  body:     { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackLg, gap: spacing.stackSm },
  section:  { ...typography.labelSm, color: colors.slateGray, marginTop: spacing.stackSm, marginBottom: spacing.stackXs, textTransform: 'uppercase' },
  card:     { backgroundColor: colors.pureWhite, borderRadius: radius.lg, paddingHorizontal: spacing.cardPadding },
  row:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.stackMd },
  rowLabel: { ...typography.bodyMd, color: colors.onSurface },
  rowValue: { ...typography.labelMd, color: colors.slateGray },
  divider:  { height: 1, backgroundColor: colors.dividerSoft },
});
