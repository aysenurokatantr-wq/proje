import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors, ThemeColors } from './colors';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  mode: ThemeMode;
  scheme: 'light' | 'dark';
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === 'light' || val === 'dark' || val === 'system') {
        setModeState(val);
      }
    });
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m);
  }, []);

  const scheme: 'light' | 'dark' =
    mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
  const colors = scheme === 'dark' ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ mode, scheme, colors, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
