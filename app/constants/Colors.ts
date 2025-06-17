const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const Colors = {
  // Primary colors
  primary: '#2f95dc',
  secondary: '#6c757d',
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  
  // Text colors
  text: '#333333',
  darkText: '#1a1a1a',
  lightText: '#666666',
  white: '#ffffff',
  
  // Background colors
  background: '#ffffff',
  lightBackground: '#f8f9fa',
  darkBackground: '#343a40',
  
  // Gray scale
  gray: '#6c757d',
  lightGray: '#e9ecef',
  darkGray: '#495057',
  
  // Border and shadow
  border: '#dee2e6',
  shadow: '#000000',
  disabled: '#adb5bd',
  
  // Theme colors (existing)
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

export default Colors;