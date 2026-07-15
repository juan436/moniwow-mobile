/**
 * CreateJarModal — Component
 *
 * @what     Asistente 3 pasos para crear una jarra: P1 nombre + Presupuesto/Blindado, P2 ícono,
 *           P3 preview + confirmar.
 * @receives 3 props: visible, onClose, onCreate
 * @processes Form local + `step` (0..2). Chrome/teclado/dots delegados a WizardSheet. Valida por paso:
 *           P1 nombre + (monto > 0 si Presupuesto), P2 ícono elegido. Con Presupuesto → tipo
 *           presupuesto (barra = nivel restante, igual que Hogar); sin él → jarra plana (igual que Libre).
 *           Blindado añade fricción al transferir (ver TransferSheet).
 * @returns  JSX — WizardSheet con los 3 pasos.
 * @props    3: visible, onClose, onCreate
 */
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { MoniInput, MoniButton, IconPicker, WizardSheet } from '@shared/components';
import { JarFlagsField } from './JarFlagsField';
import { JarPreview } from './JarPreview';
import type { CreateJarData } from '../types';

type IconName = ComponentProps<typeof MaterialIcons>['name'];
type Form = { nombre: string; iconName: IconName | null; tieneObjetivo: boolean; monto: string; isBlindado: boolean };
function emptyForm(): Form { return { nombre: '', iconName: null, tieneObjetivo: false, monto: '', isBlindado: false }; }

const TITLES = ['Nueva jarra', 'Elige un ícono', 'Confirmar'];

type Props = { visible: boolean; onClose: () => void; onCreate: (data: CreateJarData) => void };

export function CreateJarModal({ visible, onClose, onCreate }: Props) {
  const [form, setForm] = useState<Form>(emptyForm);
  const [step, setStep] = useState(0);

  useEffect(() => { if (visible) { setForm(emptyForm()); setStep(0); } }, [visible]);

  function setField<K extends keyof Form>(key: K, val: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const parsedMonto = parseFloat(form.monto.replace(',', '.'));
  const step1Ok = form.nombre.trim() !== '' && (!form.tieneObjetivo || (!isNaN(parsedMonto) && parsedMonto > 0));
  const targetAmount = form.tieneObjetivo ? parsedMonto : undefined;

  function handleSave() {
    if (!step1Ok || !form.iconName) return;
    onCreate({ name: form.nombre.trim(), iconName: form.iconName, targetAmount, isBlindado: form.isBlindado });
    onClose();
  }

  const footer =
    step === 0 ? <MoniButton label="Siguiente" onPress={() => setStep(1)} disabled={!step1Ok} />
    : step === 1 ? <MoniButton label="Siguiente" onPress={() => setStep(2)} disabled={form.iconName === null} />
    : <MoniButton label="Añadir" onPress={handleSave} variant="primary" />;

  return (
    <WizardSheet
      visible={visible}
      onClose={onClose}
      header={{ title: TITLES[step], step, stepCount: 3, onBack: step > 0 ? () => setStep(step - 1) : undefined }}
      footer={footer}
    >
      {step === 0 && (
        <>
          <MoniInput label="Nombre de la jarra" value={form.nombre} onChangeText={(v) => setField('nombre', v)} placeholder="ej. Vacaciones" />
          <JarFlagsField
            presupuesto={{
              checked: form.tieneObjetivo, monto: form.monto,
              onToggle: () => setField('tieneObjetivo', !form.tieneObjetivo),
              onChangeMonto: (v) => setField('monto', v),
            }}
            blindado={{ checked: form.isBlindado, onToggle: () => setField('isBlindado', !form.isBlindado) }}
          />
        </>
      )}
      {step === 1 && <IconPicker value={form.iconName} onChange={(v) => setField('iconName', v)} />}
      {step === 2 && <JarPreview name={form.nombre} iconName={form.iconName} targetAmount={targetAmount} isBlindado={form.isBlindado} />}
    </WizardSheet>
  );
}
