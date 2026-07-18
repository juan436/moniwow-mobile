/**
 * EditJarSheet — Component
 *
 * @what     Asistente 3 pasos para editar/eliminar una jarra: P1 nombre + Presupuesto/Blindado,
 *           P2 ícono, P3 preview + guardar/eliminar.
 * @receives 5 props: visible, jar, onClose, onSave, onDelete
 * @processes Pre-llena form con la jar activa. `step` (0..2), chrome/teclado/dots en WizardSheet.
 *           Valida igual que CreateJarSheet. Eliminar disponible en el paso final.
 * @returns  JSX — WizardSheet con los 3 pasos + botón eliminar en el último.
 * @props    5: visible, jar, onClose, onSave, onDelete
 */
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { MoniInput, MoniButton, IconPicker, WizardSheet } from '@shared/components';
import { jarCapabilities } from '@core/entities/Jar';
import { JarFlagsField } from './JarFlagsField';
import { JarPreview } from './JarPreview';
import type { JarDisplay, SaveJarData } from '../types';

type IconName = ComponentProps<typeof MaterialIcons>['name'];
type Form = { nombre: string; iconName: IconName | null; tieneObjetivo: boolean; monto: string; isBlindado: boolean };

const TITLES = ['Editar jarra', 'Elige un ícono', 'Confirmar'];

type Props = {
  visible: boolean;
  jar: JarDisplay | null;
  onClose: () => void;
  onSave: (data: SaveJarData) => void;
  onDelete: (id: string) => void;
};

export function EditJarSheet({ visible, jar, onClose, onSave, onDelete }: Props) {
  const [form, setForm] = useState<Form>({ nombre: '', iconName: null, tieneObjetivo: false, monto: '', isBlindado: false });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (visible && jar) {
      setForm({
        nombre: jar.name,
        iconName: jar.iconName ?? null,
        tieneObjetivo: jar.targetAmount !== undefined,
        monto: jar.targetAmount !== undefined ? jar.targetAmount.toString() : '',
        isBlindado: jar.isBlindado ?? false,
      });
      setStep(0);
    }
  }, [visible, jar]);

  function setField<K extends keyof Form>(key: K, val: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const caps = jar ? jarCapabilities(jar.type) : null;

  const parsedMonto = parseFloat(form.monto.replace(',', '.'));
  const step1Ok = form.nombre.trim() !== '' && (!form.tieneObjetivo || (!isNaN(parsedMonto) && parsedMonto > 0));
  const targetAmount = form.tieneObjetivo ? parsedMonto : undefined;

  function handleSave() {
    if (!step1Ok || !jar || !form.iconName) return;
    onSave({ id: jar.id, name: form.nombre.trim(), iconName: form.iconName, targetAmount, isBlindado: form.isBlindado });
    onClose();
  }

  function handleDelete() {
    if (!jar) return;
    onDelete(jar.id);
    onClose();
  }

  const footer =
    step === 0 ? <MoniButton label="Siguiente" onPress={() => setStep(1)} disabled={!step1Ok} />
    : step === 1 ? <MoniButton label="Siguiente" onPress={() => setStep(2)} disabled={form.iconName === null} />
    : (
      <>
        <MoniButton label="Guardar cambios" onPress={handleSave} />
        {caps?.canDelete && <MoniButton label="Eliminar jarra" onPress={handleDelete} variant="danger" />}
      </>
    );

  return (
    <WizardSheet
      visible={visible}
      onClose={onClose}
      header={{ title: TITLES[step], step, stepCount: 3, onBack: step > 0 ? () => setStep(step - 1) : undefined }}
      footer={footer}
    >
      {step === 0 && (
        <>
          <MoniInput label="Nombre de la jarra" value={form.nombre} onChangeText={(v) => setField('nombre', v)} placeholder="ej. Vacaciones" disabled={!caps?.canRename} />
          <JarFlagsField
            presupuesto={{
              checked: form.tieneObjetivo, monto: form.monto,
              onToggle: () => setField('tieneObjetivo', !form.tieneObjetivo),
              onChangeMonto: (v) => setField('monto', v),
              disabled: !caps?.canEditBudget,
            }}
            blindado={{ checked: form.isBlindado, onToggle: () => setField('isBlindado', !form.isBlindado), disabled: !caps?.canToggleBlindado }}
          />
        </>
      )}
      {step === 1 && <IconPicker value={form.iconName} onChange={(v) => setField('iconName', v)} />}
      {step === 2 && <JarPreview name={form.nombre} iconName={form.iconName} targetAmount={targetAmount} isBlindado={form.isBlindado} balance={jar?.balance ?? 0} />}
    </WizardSheet>
  );
}
