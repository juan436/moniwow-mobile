/**
 * WizardSheet — Component
 *
 * @what     Bottom sheet multi-paso (asistente): agrega PageIndicator + footer sobre el chrome de
 *           `MoniSheet` (handle, header con back/close, teclado, nav bar).
 * @receives 4 props: visible, onClose, header, footer (+ children)
 * @processes `header` agrupa title/step/stepCount/onBack (evita superar el límite de 5 props). El
 *           back/close y el subir con el teclado los resuelve `MoniSheet`: acá solo se añade el
 *           PageIndicator (0-based) arriba y el footer al final del ScrollView (acompaña al contenido,
 *           no scrollea el chrome).
 * @returns  JSX — sheet con indicador de pasos y contenido inyectado.
 * @props    4: visible, onClose, header, footer (children aparte)
 */
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { spacing } from '@shared/styles';
import { PageIndicator } from './PageIndicator';
import { MoniSheet } from './MoniSheet';

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

  return (
    <MoniSheet visible={visible} onClose={onClose} title={title} onBack={onBack}>
      <PageIndicator count={stepCount} active={step} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {children}
        {footer}
      </ScrollView>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd },
});
