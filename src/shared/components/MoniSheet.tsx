/**
 * MoniSheet — Component
 *
 * @what     Chrome compartido de bottom sheet: el Modal, el fondo oscuro, la hoja pegada abajo, el
 *           handle, el header opcional y la nav bar de Android. El contenido lo pone quien lo usa.
 * @receives 4 props: visible, onClose, title?, onBack? (+ children)
 * @processes **El componente que faltaba.** Había dos patrones conviviendo sin que nadie lo
 *           decidiera —cuadrito centrado (`fade`) para ver, sheet (`slide`) para crear/editar— y 18
 *           archivos repetían estos estilos a mano. Ver [[planes/dialogs-a-sheets]].
 *           **`GestureHandlerRootView` va SIEMPRE**, dentro del Modal: RN aísla gesture-handler
 *           dentro de un Modal en Android, así que sin esto el slider de Sacrificio y el de
 *           Transferir mueren. Al vivir acá, ningún consumidor puede olvidárselo — era el riesgo
 *           más grande del plan.
 *           **Sin ScrollView**: los detalles no scrollean y meterles uno anidaría con el de los
 *           formularios. El body lo arma quien lo usa; el sheet sube con el teclado por
 *           `marginBottom`, que es chrome y no depende del scroll.
 *           Tocar el fondo cierra; `onStartShouldSetResponder` evita que el toque dentro de la hoja
 *           se propague al fondo y la cierre.
 * @returns  JSX — Modal slide-up con la hoja y el contenido inyectado.
 * @props    4: visible, onClose, title?, onBack? (children aparte)
 */
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';

import { colors, typography, spacing, radius } from '../styles';
import { useKeyboardHeight } from '../hooks/useKeyboardHeight';

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Sin título no se dibuja header — los detalles arman el suyo. */
  title?: string;
  /** Con `onBack` el ícono izquierdo es una flecha en vez de la X (wizards multi-paso). */
  onBack?: () => void;
  children: ReactNode;
};

function stopPropagation() { return true; }

export function MoniSheet({ visible, onClose, title, onBack, children }: Props) {
  const insets = useSafeAreaInsets();
  const kbHeight = useKeyboardHeight();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <GestureHandlerRootView style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View style={[styles.sheet, { marginBottom: kbHeight }]} onStartShouldSetResponder={stopPropagation}>
            <View style={styles.handle} />
            {title !== undefined && (
              <View style={styles.header}>
                {onBack && (
                  <Pressable onPress={onBack} hitSlop={8} style={styles.headerBtn}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.slateGray} />
                  </Pressable>
                )}
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Pressable onPress={onClose} hitSlop={8} style={styles.headerBtn}>
                  <MaterialIcons name="close" size={24} color={colors.slateGray} />
                </Pressable>
              </View>
            )}
            {children}
          </View>
        </Pressable>
        <View style={[styles.navBarCover, { height: insets.bottom }]} />
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1 },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: `${colors.navyDark}8C` },
  sheet: {
    backgroundColor: colors.pureWhite,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    maxHeight: '90%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant,
    alignSelf: 'center', marginTop: spacing.stackSm, marginBottom: spacing.stackXs,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackXs, paddingBottom: spacing.stackSm,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '44',
  },
  headerBtn: { width: 24, alignItems: 'center' },
  title:     { ...typography.headlineMd, color: colors.navyDark, flex: 1, textAlign: 'left' },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
});
