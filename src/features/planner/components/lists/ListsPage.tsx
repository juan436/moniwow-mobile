/**
 * ListsPage — Component
 *
 * @what     Tab Listas (índice): botón nueva lista + filas compactas. Cada lista es una fila; tap
 *           abre su page única (`app/lista/[id]`). El detalle (checklist, mic, Limpiar, borrar ítem)
 *           vive allá — acá solo se navega y se borra una lista con swipe.
 * @receives 2 props: scrollY, topOffset
 * @processes `useLists` da las listas del store compartido. Tap fila → router.push. Swipe fila →
 *           deleteList (dentro de `ListRow`).
 * @returns  JSX — ScrollView vertical con las filas.
 * @props    2: scrollY, topOffset
 */
import { useState, useCallback } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { colors, spacing } from '@shared/styles';
import { MoniButton } from '@shared/components';
import { ListRow } from './ListRow';
import { CreateListSheet } from './CreateListSheet';
import { useLists } from '../../hooks/useLists';

type Props = {
  scrollY: Animated.Value;
  topOffset: number;
};

export function ListsPage({ scrollY, topOffset }: Props) {
  const { listas, deleteList, createList }    = useLists();
  const [showAnadirLista, setShowAnadirLista] = useState(false);

  const handleAnadir     = useCallback(() => setShowAnadirLista(true), []);
  const handleCloseLista = useCallback(() => setShowAnadirLista(false), []);
  const handleOpen       = useCallback((listaId: string) => router.push({ pathname: '/lista/[id]', params: { id: listaId } }), []);

  return (
    <>
      <Animated.ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: topOffset }]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        <View style={styles.actions}>
          <MoniButton label="Añadir" onPress={handleAnadir} />
        </View>
        <View style={styles.list}>
          {listas.map((lista) => (
            <ListRow key={lista.id} lista={lista} onPress={handleOpen} onDelete={deleteList} />
          ))}
        </View>
      </Animated.ScrollView>

      <CreateListSheet visible={showAnadirLista} onClose={handleCloseLista} onCreate={createList} />
    </>
  );
}

const styles = StyleSheet.create({
  scroll:  { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.stackLg, gap: spacing.stackSm },
  actions: { paddingTop: spacing.stackMd, paddingBottom: spacing.stackMd, paddingHorizontal: spacing.marginPage },
  list:    { paddingHorizontal: spacing.marginPage, gap: spacing.stackMd },
});
