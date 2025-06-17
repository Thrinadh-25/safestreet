/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from 'react-native';

import { Colors } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

// Define the keys available in your Colors object
type ColorName = keyof typeof Colors;

// Modified useThemeColor to work with flat Colors structure
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: 'text' | 'background' // Specify expected color names
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  // Since Colors is flat, we directly access it
  // Map 'background' to 'lightBackground' since Colors doesn't have 'background'
  if (colorName === 'background') {
    // Try to use Colors.background if it exists, otherwise fallback to white
    return Colors.background ?? Colors.white;
  }

  // For 'text', Colors has a matching key
  if (colorName === 'text') {
    return Colors.text;
  }

  // Fallback to white if colorName doesn't match (though this shouldn't happen with our limited colorName type)
  return Colors.white;
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}