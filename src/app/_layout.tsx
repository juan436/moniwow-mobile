import { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { AuthProvider } from '@shared/context/AuthProvider';
import { useAuth } from '@shared/hooks/useAuth';
import { useJarsStore } from '@features/jars/stores/jarsStore';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import { colors } from '@shared/styles';

/**
 * StoreIdentityReset — Component
 *
 * @what     Vacía `jarsStore`/`transactionsStore` cuando cambia la identidad logueada (FB-019).
 * @processes Los dos stores hidratan UNA vez por proceso JS (`hydrating` module-level nunca se
 *           limpiaba) — cambiar de cuenta u hogar sin matar la app dejaba las jarras/libro de la
 *           cuenta ANTERIOR pegados en pantalla, aunque el token ya fuera otro. Vive en `app/`
 *           (composition root, único lugar permitido para tocar `shared/` y `features/` a la vez —
 *           `AuthProvider` no puede importar stores de `features/`, ver clean_architecture.md) y
 *           observa `user` — cualquier transición (login, logout, crear/unirse a workspace, todas
 *           pasan por `signIn`/`signOut`) dispara el reset. No resetea en el primer render (nada que
 *           limpiar todavía).
 * @returns  null — efecto puro, sin UI.
 */
function StoreIdentityReset() {
  const { user } = useAuth();
  const key = user ? `${user.id}:${user.workspaceId}` : null;
  const prevKey = useRef(key);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current && prevKey.current !== key) {
      useJarsStore.getState().reset();
      useTransactionsStore.getState().reset();
    }
    prevKey.current = key;
    mounted.current = true;
  }, [key]);

  return null;
}

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const [loaded] = useFonts({
    Outfit_600SemiBold,
    Outfit_700Bold,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    NavigationBar.setButtonStyleAsync('light');
  }, []);

  if (!loaded) {
    return <View />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      {/* Envuelve TODAS las rutas: la sesión se restaura una vez, no una por pantalla. */}
      <AuthProvider>
        <StoreIdentityReset />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  navBarCover: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.black,
  },
});
