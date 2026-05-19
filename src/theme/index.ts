import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';
import { LightColors, ThemeColors } from './colors';

export { LightColors, DarkColors } from './colors';
export type { ThemeColors } from './colors';
export { ThemeProvider, useTheme } from './ThemeContext';

// Backwards-compatible static export — always light theme
export const Colors = LightColors;

export const Fonts = {
  serif: 'Georgia',
  sansSerif: 'System',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
};

export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: ThemeColors) => T
) {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}
