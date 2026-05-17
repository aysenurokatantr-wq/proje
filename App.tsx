import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabNavigator from './src/navigation/TabNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { Colors } from './src/theme';

export default function App() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('onboarding_done').then((val) => {
      setOnboarded(val === 'true');
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {onboarded ? (
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      ) : (
        <OnboardingScreen onDone={() => setOnboarded(true)} />
      )}
    </SafeAreaProvider>
  );
}
