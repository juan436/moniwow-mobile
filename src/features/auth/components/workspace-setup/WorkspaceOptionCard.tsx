import { Pressable, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { WorkspaceType } from '@core/entities/Workspace';
import { colors, typography, spacing, radius, shadows } from '@shared/styles';

export type WorkspaceOption = {
  id: WorkspaceType | 'join';
  icon: 'person' | 'group' | 'vpn-key';
  title: string;
  description: string;
};

type WorkspaceOptionCardProps = {
  option: WorkspaceOption;
  active: boolean;
  onPress: (id: WorkspaceType | 'join') => void;
};

export function WorkspaceOptionCard({ option, active, onPress }: WorkspaceOptionCardProps) {
  return (
    <Pressable
      onPress={() => onPress(option.id)}
      style={({ pressed }) => [
        styles.card,
        active && styles.cardActive,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={[styles.iconBox, active && styles.iconBoxActive]}>
        <MaterialIcons
          name={option.icon}
          size={20}
          color={active ? colors.pureWhite : colors.emeraldSuccess}
        />
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, active && styles.titleActive]}>{option.title}</Text>
        <Text style={styles.description}>{option.description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackMd,
    padding: spacing.stackMd,
    backgroundColor: colors.pureWhite,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    ...shadows.card,
  },
  cardActive: {
    borderColor: colors.emeraldSuccess,
    borderWidth: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconBoxActive: {
    backgroundColor: colors.emeraldSuccess,
  },
  body: {
    flex: 1,
    gap: spacing.stackXs,
  },
  title: {
    ...typography.bodyLg,
    color: colors.navyDark,
  },
  titleActive: {
    color: colors.primary,
  },
  description: {
    ...typography.bodyMd,
    color: colors.slateGray,
  },
});
