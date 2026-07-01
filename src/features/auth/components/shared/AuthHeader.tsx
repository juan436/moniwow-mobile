import { View, Text, StyleSheet } from 'react-native';
import { MoniLogo } from '@shared/components';
import { colors, typography, spacing } from '@shared/styles';

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  compact?: boolean;
};

export function AuthHeader({ title, subtitle, compact = false }: AuthHeaderProps) {
  return (
    <View style={[styles.header, compact && styles.headerCompact]}>
      <MoniLogo width={compact ? 72 : 96} height={compact ? 39 : 52} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.marginPage,
    paddingTop: spacing.stackLg,
    paddingBottom: spacing.stackMd,
    gap: spacing.stackMd,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  headerCompact: {
    paddingTop: spacing.stackMd,
    paddingBottom: spacing.stackSm,
    gap: spacing.stackSm,
  },
  title: {
    ...typography.headlineLg,
    color: colors.navyDark,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.slateGray,
    textAlign: 'center',
  },
});
