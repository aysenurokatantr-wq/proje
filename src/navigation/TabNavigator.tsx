import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import AffirmationsScreen from '../screens/AffirmationsScreen';
import JournalScreen from '../screens/JournalScreen';
import TapesScreen from '../screens/TapesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors, Radius } from '../theme';

const Tab = createBottomTabNavigator();

type TabItem = {
  name: string;
  label: string;
  icon: string;
};

const tabs: TabItem[] = [
  { name: 'Affirmations', label: 'Olumlamalar', icon: 'reader' },
  { name: 'Journal', label: 'Günlük', icon: 'book' },
  { name: 'Tapes', label: 'Kasetler', icon: 'play-circle' },
  { name: 'Profile', label: 'Profil', icon: 'person-circle' },
];

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom || 12 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const tab = tabs[index];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon as any}
              size={22}
              color={isFocused ? Colors.purple : Colors.grayDark}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Affirmations" component={AffirmationsScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Tapes" component={TapesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: 10,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    gap: 3,
    borderRadius: Radius.lg,
  },
  tabItemActive: {
    backgroundColor: Colors.purplePale,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.grayDark,
  },
  tabLabelActive: {
    color: Colors.purple,
  },
});
