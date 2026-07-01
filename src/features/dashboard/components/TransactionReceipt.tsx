/**
 * TransactionReceipt — Component
 *
 * @what     Bloque de factura: imagen si receiptUri existe, placeholder si no.
 * @receives 1 prop: receiptUri
 * @processes Rama si/no — Image o tarjeta dashed con icono cámara.
 * @returns  JSX — sección con label "Factura" + imagen o placeholder.
 * @props    1: receiptUri
 */
import { View, Image, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius } from '@shared/styles';

type Props = { receiptUri?: string };

export function TransactionReceipt({ receiptUri }: Props) {
  if (receiptUri) {
    return (
      <View style={styles.block}>
        <Text style={styles.label}>Factura</Text>
        <Image source={{ uri: receiptUri }} style={styles.image} resizeMode="contain" />
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.label}>Factura</Text>
      <View style={styles.placeholder}>
        <MaterialIcons name="camera-alt" size={24} color={colors.slateGray} />
        <Text style={styles.placeholderText}>Añadir factura</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block:           { gap: spacing.stackSm },
  label:           { ...typography.labelMd, color: colors.slateGray },
  image:           { width: '100%', height: 180, borderRadius: radius.card },
  placeholder:     { borderWidth: 1, borderColor: colors.surfaceContainerHigh, borderStyle: 'dashed', borderRadius: radius.card, paddingVertical: spacing.stackLg, alignItems: 'center', gap: spacing.stackSm },
  placeholderText: { ...typography.bodyMd, color: colors.slateGray },
});
