const tintColorLight = '#007AFF';
const tintColorDark = '#0A84FF';

export const Colors = {
  // Primary colors
  primary: '#007AFF',
  secondary: '#6c757d',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  
  // Theme-specific colors
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#C7C7CC',
    tabIconSelected: tintColorLight,
    cardBackground: '#FFFFFF',
    borderColor: '#E5E5EA',
    placeholderText: '#8E8E93',
    secondaryBackground: '#F2F2F7',
    separator: '#C6C6C8',
    headerBackground: '#FFFFFF',
    sectionBackground: '#F2F2F7',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: tintColorDark,
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    cardBackground: '#000000', // Changed from #1C1C1E to match background
    borderColor: '#2C2C2E', // Lighter border for subtle separation
    placeholderText: '#8E8E93',
    secondaryBackground: '#000000', // Changed from #1C1C1E to match background
    separator: '#2C2C2E', // Lighter separator
    headerBackground: '#000000',
    sectionBackground: '#000000',
  },
};

export default Colors;