import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Onest_400Regular, Onest_500Medium, Onest_600SemiBold, Onest_700Bold, Onest_800ExtraBold } from '@expo-google-fonts/onest';
import { JetBrainsMono_500Medium, JetBrainsMono_600SemiBold } from '@expo-google-fonts/jetbrains-mono';
import { AppProvider, useApp } from '../store';
import { ToastHost } from '../ui';

function Root() {
  const { c, dark } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="create" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="published" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="donation-success" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="support/done" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack>
      <ToastHost />
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Onest_400Regular, Onest_500Medium, Onest_600SemiBold, Onest_700Bold, Onest_800ExtraBold,
    JetBrainsMono_500Medium, JetBrainsMono_600SemiBold,
  });
  if (!loaded) return <View style={{ flex: 1, backgroundColor: '#C4162A' }} />;
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}
