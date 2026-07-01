import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { colors } from '@shared/styles';

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
      <Stack screenOptions={{ headerShown: false }} />
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
