/**
 * JarFlagsField — Component
 *
 * @what     Fila de checkboxes "Presupuesto" + "Blindado" + input de monto condicional.
 * @receives 2 props: presupuesto, blindado
 * @processes Ambos checkboxes en una sola fila para ahorrar espacio vertical (antes uno debajo del
 *           otro). Presupuesto marcado muestra el input "Presupuesto ($)" debajo. Compartido entre
 *           CreateJarSheet y EditJarSheet.
 * @returns  JSX — Fragment: fila con 2 Checkbox + MoniInput condicional.
 * @props    2: presupuesto, blindado
 */
import { View, StyleSheet } from 'react-native';

import { spacing } from '@shared/styles';
import { MoniInput, Checkbox } from '@shared/components';

type Props = {
  presupuesto: { checked: boolean; monto: string; onToggle: () => void; onChangeMonto: (v: string) => void; disabled?: boolean };
  blindado: { checked: boolean; onToggle: () => void; disabled?: boolean };
};

export function JarFlagsField({ presupuesto, blindado }: Props) {
  return (
    <>
      <View style={styles.row}>
        <Checkbox checked={presupuesto.checked} label="Presupuesto" onToggle={presupuesto.onToggle} disabled={presupuesto.disabled} />
        <Checkbox checked={blindado.checked} label="Blindado" onToggle={blindado.onToggle} disabled={blindado.disabled} />
      </View>
      {presupuesto.checked && (
        <MoniInput
          label="Presupuesto ($)"
          value={presupuesto.monto}
          onChangeText={presupuesto.onChangeMonto}
          placeholder="1500"
          inputType="numeric"
          disabled={presupuesto.disabled}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.stackLg },
});
