import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabNavigator from './src/navigation/TabNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { ThemeProvider, useTheme } from './src/theme';

function AppContent() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const { scheme, colors } = useTheme();

  useEffect(() => {
    AsyncStorage.getItem('onboarding_done').then((val) => {
      setOnboarded(val === 'true');
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const navTheme = scheme === 'dark'
    ? {
        ...DarkTheme,
        colors: { ...DarkTheme.colors, background: colors.background, card: colors.surface, text: colors.text, border: colors.border, primary: colors.primary },
      }
    : {
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: colors.background, card: colors.surface, text: colors.text, border: colors.border, primary: colors.primary },
      };

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {onboarded ? (
        <NavigationContainer theme={navTheme}>
          <TabNavigator />
        </NavigationContainer>
      ) : (
        <OnboardingScreen onDone={() => setOnboarded(true)} />
      )}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
