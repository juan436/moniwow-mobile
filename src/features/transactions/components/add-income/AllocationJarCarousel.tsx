/**
 * AllocationJarCarousel — Component
 *
 * @what     Carrusel horizontal de jarras para distribuir ingreso: páginas de 6.
 * @receives 5 props: jars, distribution, onSelectJar, activePage, onPageChange
 * @processes Ordena jarras base (Libre/Hogar/Ahorro, M03 "inborrables") primero, personalizadas
 *           después en su orden original. Agrupa en páginas de PAGE_SIZE — filas son solo
 *           tocables (sin TextInput), así que a diferencia del intento anterior no hay conflicto
 *           de gestos ni problema de teclado. Página controlada desde afuera (no estado propio):
 *           el carrusel se desmonta al abrir el numpad de una jarra, así que sin esto se perdía
 *           la página al volver. Indicador de página solo si hay más de una.
 * @returns  JSX — PagerView con AllocationJarRow por jarra + PageIndicator condicional.
 * @props    5: jars, distribution, onSelectJar, activePage, onPageChange
 */
import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

import { spacing } from '@shared/styles';
import { PageIndicator } from '@shared/components';
import { AllocationJarRow } from './AllocationJarRow';
import type { JarOption, IncomeDistribution, JarId } from '../../types';

const PAGE_SIZE  = 6;
const ROW_HEIGHT = 60;
const PAGE_HEIGHT = PAGE_SIZE * ROW_HEIGHT + (PAGE_SIZE - 1) * spacing.stackXs + spacing.stackMd;
const BASE_ORDER: JarId[] = ['libre', 'hogar', 'ahorro'];

function orderJars(jars: JarOption[]): JarOption[] {
  const base = BASE_ORDER
    .map((id) => jars.find((j) => j.id === id))
    .filter((j): j is JarOption => !!j);
  const custom = jars.filter((j) => !BASE_ORDER.includes(j.id as JarId));
  return [...base, ...custom];
}

function chunk(jars: JarOption[], size: number): JarOption[][] {
  const pages: JarOption[][] = [];
  for (let i = 0; i < jars.length; i += size) pages.push(jars.slice(i, i + size));
  return pages;
}

type Props = {
  jars: JarOption[]; distribution: IncomeDistribution; onSelectJar: (jarId: string) => void;
  activePage: number; onPageChange: (page: number) => void;
};

export function AllocationJarCarousel({ jars, distribution, onSelectJar, activePage, onPageChange }: Props) {
  const pages = useMemo(() => chunk(orderJars(jars), PAGE_SIZE), [jars]);

  return (
    <View>
      <PagerView
        style={styles.pager}
        initialPage={activePage}
        onPageSelected={(e) => onPageChange(e.nativeEvent.position)}
      >
        {pages.map((pageJars, i) => (
          <View key={i} style={styles.page}>
            {pageJars.map((jar) => (
              <AllocationJarRow
                key={jar.id}
                jar={jar}
                amount={distribution[jar.id] ?? 0}
                onPress={() => onSelectJar(jar.id)}
              />
            ))}
          </View>
        ))}
      </PagerView>
      {pages.length > 1 && (
        <PageIndicator count={pages.length} active={activePage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pager: { height: PAGE_HEIGHT },
  page:  { paddingHorizontal: spacing.marginPage, paddingBottom: spacing.stackMd, gap: spacing.stackXs },
});
