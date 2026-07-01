/**
 * JarSelectCarousel — Component
 *
 * @what     Carrusel horizontal para elegir la jarra de origen del gasto: páginas de 8.
 * @receives 3 props: jars, selectedJar, onSelectJar
 * @processes Ordena jarras base (Libre/Hogar/Ahorro, M03 "inborrables") primero, personalizadas
 *           después en su orden original. Tocar una fila selecciona al instante — sin numpad,
 *           acá solo se elige de qué jarra sale el gasto (ya viene con monto del Paso 1).
 * @returns  JSX — PagerView con JarSelectRow por jarra + PageIndicator condicional.
 * @props    3: jars, selectedJar, onSelectJar
 */
import { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

import { spacing } from '@shared/styles';
import { PageIndicator } from '@shared/components';
import { JarSelectRow } from './JarSelectRow';
import type { JarOption, JarId } from '../../types';

const PAGE_SIZE  = 8;
const ROW_HEIGHT = 64; // 60 de contenido + 4 del borde de selección (2px arriba y abajo)
const PAGE_HEIGHT = PAGE_SIZE * ROW_HEIGHT + (PAGE_SIZE - 1) * spacing.stackSm + spacing.stackMd;
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

type Props = { jars: JarOption[]; selectedJar: string; onSelectJar: (jarId: string) => void };

export function JarSelectCarousel({ jars, selectedJar, onSelectJar }: Props) {
  const [activePage, setActivePage] = useState(0);
  const pages = useMemo(() => chunk(orderJars(jars), PAGE_SIZE), [jars]);

  return (
    <View>
      <PagerView style={styles.pager} onPageSelected={(e) => setActivePage(e.nativeEvent.position)}>
        {pages.map((pageJars, i) => (
          <View key={i} style={styles.page}>
            {pageJars.map((jar) => (
              <JarSelectRow
                key={jar.id}
                jar={jar}
                isSelected={jar.id === selectedJar}
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
  page:  { paddingHorizontal: spacing.marginPage, paddingBottom: spacing.stackMd, gap: spacing.stackSm },
});
