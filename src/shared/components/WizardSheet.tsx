/**
 * WizardSheet — Component
 *
 * @what     Chrome compartido de bottom sheet multi-paso (asistente): handle, header con back/close,
 *           PageIndicator de pasos, ScrollView con padding de teclado y footer fijo al final.
 * @receives 4 props: visible, onClose, header, footer (+ children)
 * @processes `header` agrupa title/step/stepCount/onBack (evita superar el límite de 5 props). Header
 *           muestra flecha atrás si `onBack` (paso > 0) o cierra si no. PageIndicator refleja `step`
 *           (0-based). Gestiona alto de teclado internamente (mismo patrón que los modales previos)
 *           para scrollear el campo tapado sin mover el sheet. Footer va al final del ScrollView (no
 *           scrollea el chrome, sí acompaña al contenido — igual que el CTA anterior).
 * @returns  JSX — Modal slide-up con sheet, indicador de pasos y contenido inyectado.
 * @props    4: visible, onClose, header, footer (children aparte)
 */
import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, Keyboard, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { colors, typography, spacing, radius } from '@shared/styles';
import { PageIndicator } from './PageIndicator';

type WizardHeader = { title: string; step: number; stepCount: number; onBack?: () => void };
type Props = {
  visible: boolean;
  onClose: () => void;
  header: WizardHeader;
  footer: ReactNode;
  children: ReactNode;
};

export function WizardSheet({ visible, onClose, header, footer, children }: Props) {
  const { title, step, stepCount, onBack } = header;
  const insets = useSafeAreaInsets();
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKbHeight(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKbHeight(0),
    );
    return () => { show.remove(); hide.remove(); };
  }, []);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Pressable onPress={onBack ?? onClose} hitSlop={8} style={styles.headerBtn}>
              <MaterialIcons name={onBack ? 'arrow-back' : 'close'} size={24} color={colors.slateGray} />
            </Pressable>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.headerBtn}>
              <MaterialIcons name="close" size={24} color={colors.slateGray} />
            </Pressable>
          </View>
          <PageIndicator count={stepCount} active={step} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg + kbHeight }]}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
          >
            {children}
            {footer}
          </ScrollView>
        </View>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:    { flex: 1, justifyContent: 'flex-end', backgroundColor: `${colors.navyDark}8C` },
  sheet:       { backgroundColor: colors.pureWhite, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card, maxHeight: '90%' },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
  handle:      { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant, alignSelf: 'center', marginTop: spacing.stackSm, marginBottom: spacing.stackXs },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackXs, paddingBottom: spacing.stackSm,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '44',
  },
  headerBtn: { width: 24, alignItems: 'center' },
  title:     { ...typography.headlineMd, color: colors.navyDark },
  body:      { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd },
});
