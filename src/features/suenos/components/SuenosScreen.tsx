/**
 * SuenosScreen — Component (Screen)
 *
 * @what     M10 — Proyectos de Vida: resumen compacto + lista de metas + hide-on-scroll.
 * @receives —
 * @processes AppTopBar se oculta al hacer scroll down y reaparece al subir.
 * @returns  JSX — header flotante animado + ScrollView con summary card + cards.
 * @props    —
 */
import { useCallback, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { AppTopBar } from '@shared/components';
import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { GoalCard, type GoalItem } from './GoalCard';
import { AnadirSuenoModal, type CreateGoalData } from './AnadirSuenoModal';
import { EditarSuenoModal, type SaveGoalData } from './EditarSuenoModal';

const AHORRO_TOTAL = 29500;

const INITIAL_GOALS: GoalItem[] = [
  { id: '1', emoji: '🚗', name: 'Mi Carro Nuevo',   statusLabel: 'Progreso Constante', current: 4000,  target: 10000,  progress: 40 },
  { id: '2', emoji: '✈️', name: 'Viaje a Japón',    statusLabel: 'Apenas comenzando',  current: 500,   target: 5000,   progress: 10 },
  { id: '3', emoji: '🏠', name: 'Fondo Casa',        statusLabel: 'Vas muy bien',       current: 25000, target: 50000,  progress: 50 },
  { id: '4', emoji: '💻', name: 'MacBook Pro',       statusLabel: '¡Ya casi!',          current: 3200,  target: 3500,   progress: 91 },
  { id: '5', emoji: '🎓', name: 'Maestría',          statusLabel: 'En camino',          current: 6000,  target: 20000,  progress: 30 },
  { id: '6', emoji: '🏖️', name: 'Vacaciones Caribe', statusLabel: 'Soñando despierto',  current: 200,   target: 4000,   progress: 5  },
  { id: '7', emoji: '💍', name: 'Anillo de Compromiso', statusLabel: 'Guardando en secreto', current: 1800, target: 3000, progress: 60 },
  { id: '8', emoji: '🛵', name: 'Moto Eléctrica',   statusLabel: 'Progreso Constante', current: 900,   target: 2500,   progress: 36 },
];

export function SuenosScreen() {
  const insets = useSafeAreaInsets();
  const [goals, setGoals] = useState<GoalItem[]>(INITIAL_GOALS);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);
  const handleAnadir     = useCallback(() => setIsAddVisible(true), []);
  const handleCreate     = useCallback((_data: CreateGoalData) => { /* TODO: CreateGoal use-case */ }, []);
  const handleCardPress  = useCallback((goal: GoalItem) => setSelectedGoal(goal), []);
  const handleSave       = useCallback((data: SaveGoalData) => setGoals((g) => g.map((x) => x.id === data.id ? { ...x, name: data.name, emoji: data.icon, target: data.targetAmount } : x)), []);
  const handleDelete     = useCallback((id: string) => setGoals((g) => g.filter((x) => x.id !== id)), []);
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(1, headerHeight)],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.screen}>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: headerHeight }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={[styles.summaryCard, shadows.card]}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryLabel}>Ahorro total acumulado</Text>
            <Text style={styles.summaryAmount}>$ {AHORRO_TOTAL.toLocaleString('es')}.00</Text>
          </View>
          <Pressable style={styles.btnNew} onPress={handleAnadir}>
            <Text style={styles.btnNewText}>Añadir</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis proyectos</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{goals.length}</Text>
          </View>
        </View>

        <View style={styles.cardList}>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onPress={handleCardPress} />
          ))}
        </View>
      </Animated.ScrollView>

      <AnadirSuenoModal visible={isAddVisible} onClose={() => setIsAddVisible(false)} onCreate={handleCreate} />
      <EditarSuenoModal visible={selectedGoal !== null} goal={selectedGoal} onClose={() => setSelectedGoal(null)} onSave={handleSave} onDelete={handleDelete} />

      <View style={[styles.statusBarBg, { height: insets.top }]} />
      <Animated.View
        style={[styles.headerFloat, { transform: [{ translateY: headerTranslateY }] }]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <AppTopBar />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.background },
  scroll:      { flex: 1 },
  content:     { flexGrow: 1, paddingBottom: spacing.stackLg * 2 },
  statusBarBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, backgroundColor: colors.pureWhite },
  headerFloat: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: colors.pureWhite },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.pureWhite,
    marginHorizontal: spacing.marginPage,
    marginTop: spacing.stackMd,
    borderRadius: radius.xl,
    padding: spacing.cardPadding,
  },
  summaryLeft:   { gap: spacing.stackXs },
  summaryLabel:  { ...typography.labelMd, color: colors.slateGray },
  summaryAmount: { ...typography.headlineMd, color: colors.goldDreams },

  btnNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackXs,
    backgroundColor: colors.goldDreams,
    paddingHorizontal: spacing.stackMd,
    paddingVertical: spacing.stackSm,
    borderRadius: radius.full,
  },
  btnNewText: { ...typography.labelMd, color: colors.pureWhite },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    paddingHorizontal: spacing.marginPage,
    paddingTop: spacing.stackMd,
    paddingBottom: spacing.stackSm,
  },
  sectionTitle: { ...typography.bodyMdBold, color: colors.navyDark },
  countBadge: {
    backgroundColor: colors.navyTint,
    borderRadius: radius.full,
    paddingHorizontal: spacing.stackSm,
    paddingVertical: spacing.stackXs,
  },
  countText: { ...typography.labelXs, color: colors.navyDark },

  cardList: { gap: spacing.stackMd, paddingHorizontal: spacing.marginPage },
});
