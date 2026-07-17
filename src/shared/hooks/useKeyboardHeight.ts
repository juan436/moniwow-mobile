/**
 * useKeyboardHeight — Hook
 *
 * @what     Alto del teclado en píxeles, 0 si está cerrado. Para que un sheet suba con él en vez de
 *           quedar tapado.
 * @receives —
 * @processes iOS avisa con `keyboardWillShow` (empieza la animación) y Android con
 *           `keyboardDidShow` (ya terminó): usar el que no corresponde deja el sheet a destiempo.
 *           Estaba copiado igual en 8 archivos (WizardSheet, TransferSheet, los Create/Edit…);
 *           acá vive una sola vez.
 * @returns  number — alto del teclado.
 */
import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setHeight(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setHeight(0),
    );
    return () => { show.remove(); hide.remove(); };
  }, []);

  return height;
}
