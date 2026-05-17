import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JournalScreen from '../screens/JournalScreen';
import JournalHistoryScreen from '../screens/JournalHistoryScreen';

const Stack = createNativeStackNavigator();

export default function JournalStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JournalHome" component={JournalScreen} />
      <Stack.Screen name="JournalHistory" component={JournalHistoryScreen} />
    </Stack.Navigator>
  );
}
