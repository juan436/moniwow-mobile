/**
 * AyudaScreen — Screen (/ayuda)
 *
 * @what     Ayuda y soporte V1: FAQ breve + contacto directo + versión de la app.
 * @receives —
 * @processes Contenido estático (uso personal). FAQ como tarjetas pregunta/respuesta. Filas de
 *           contacto sin acción real aún — TODO abrir correo/WhatsApp.
 * @returns  JSX — header + FAQ + contacto + versión.
 */
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { ScreenHeader } from '@shared/components';

type Faq = { q: string; a: string };

const FAQS: Faq[] = [
  { q: '¿Qué es una jarra?', a: 'Un sobre virtual donde separás dinero para un fin: Hogar, Comida, un viaje, etc.' },
  { q: '¿Qué es el Fondo Seguridad?', a: 'Una jarra blindada: para sacar dinero tenés que confirmar el sacrificio, así evitás gastos impulsivos.' },
  { q: '¿Cómo registro una compra?', a: 'Tocá el botón central (+) y elegí la jarra. Podés cargar los ítems a mano o desde una lista.' },
];

export default function AyudaScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Ayuda y soporte" />
      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>Guía rápida para usar MoniWow en casa.</Text>

        <Text style={styles.section}>Preguntas frecuentes</Text>
        {FAQS.map((f) => (
          <View key={f.q} style={styles.card}>
            <Text style={styles.question}>{f.q}</Text>
            <Text style={styles.answer}>{f.a}</Text>
          </View>
        ))}

        <Text style={styles.section}>¿Necesitás ayuda?</Text>
        <View style={styles.card}>
          <View style={styles.contactRow}>
            <MaterialIcons name="mail-outline" size={22} color={colors.emeraldSuccess} />
            <Text style={styles.contactText}>juancvillefer@gmail.com</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.contactRow}>
            <MaterialIcons name="chat-bubble-outline" size={22} color={colors.emeraldSuccess} />
            <Text style={styles.contactText}>Escribinos por WhatsApp</Text>
          </View>
        </View>

        <Text style={styles.version}>MoniWow · versión 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.background },
  body:        { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackLg, gap: spacing.stackSm },
  intro:       { ...typography.bodyMd, color: colors.onSurfaceVariant },
  section:     { ...typography.labelSm, color: colors.slateGray, marginTop: spacing.stackMd, marginBottom: spacing.stackXs, textTransform: 'uppercase' },
  card:        { backgroundColor: colors.pureWhite, borderRadius: radius.lg, padding: spacing.cardPadding, gap: spacing.stackXs },
  question:    { ...typography.bodyMdBold, color: colors.navyDark },
  answer:      { ...typography.labelMd, color: colors.onSurfaceVariant },
  contactRow:  { flexDirection: 'row', alignItems: 'center', gap: spacing.gutter, paddingVertical: spacing.stackSm },
  contactText: { ...typography.bodyMd, color: colors.onSurface },
  divider:     { height: 1, backgroundColor: colors.dividerSoft },
  version:     { ...typography.labelSm, color: colors.slateGray, textAlign: 'center', marginTop: spacing.stackLg },
});
