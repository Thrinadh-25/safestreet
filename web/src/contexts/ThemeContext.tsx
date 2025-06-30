import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { createTheme, Theme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
}

type ThemeAction =
  | { type: 'SET_MODE'; payload: ThemeMode }
  | { type: 'SET_SYSTEM_THEME'; payload: boolean };

const initialState: ThemeState = {
  mode: 'system',
  isDark: false,
};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_SYSTEM_THEME':
      return { ...state, isDark: action.payload };
    default:
      return state;
  }
};

interface ThemeContextType {
  state: ThemeState;
  setThemeMode: (mode: ThemeMode) => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const createAppTheme = (isDark: boolean): Theme => {
  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: '#007AFF',
        light: '#4DA3FF',
        dark: '#0056CC',
      },
      secondary: {
        main: '#34C759',
        light: '#5DD87A',
        dark: '#28A745',
      },
      background: {
        default: isDark ? '#121212' : '#f8f9fa',
        paper: isDark ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDark ? '#ffffff' : '#1a1a1a',
        secondary: isDark ? '#b3b3b3' : '#6c757d',
      },
      divider: isDark ? '#2c2c2e' : '#e9ecef',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        selected: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isDark 
              ? '0 4px 12px rgba(0,0,0,0.3)' 
              : '0 4px 12px rgba(0,0,0,0.05)',
            border: isDark 
              ? '1px solid #2c2c2e' 
              : '1px solid #f0f0f0',
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            color: isDark ? '#ffffff' : '#1a1a1a',
            boxShadow: isDark 
              ? '0 1px 3px rgba(0,0,0,0.3)' 
              : '0 1px 3px rgba(0,0,0,0.1)',
            borderBottom: isDark 
              ? '1px solid #2c2c2e' 
              : '1px solid #e9ecef',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            borderRight: isDark 
              ? '1px solid #2c2c2e' 
              : '1px solid #e9ecef',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: '#007AFF',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#0056CC',
              },
              '& .MuiListItemIcon-root': {
                color: '#ffffff',
              },
            },
            '&:hover': {
              backgroundColor: isDark 
                ? 'rgba(0, 122, 255, 0.1)' 
                : 'rgba(0, 122, 255, 0.05)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDark ? '#2c2c2e' : '#ffffff',
              '& fieldset': {
                borderColor: isDark ? '#3c3c3e' : '#e0e0e0',
              },
              '&:hover fieldset': {
                borderColor: isDark ? '#4c4c4e' : '#c0c0c0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#007AFF',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#2c2c2e' : '#f0f0f0',
            color: isDark ? '#ffffff' : '#1a1a1a',
          },
        },
      },
    },
  });
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load saved theme preference
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
      dispatch({ type: 'SET_MODE', payload: savedMode });
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch({ type: 'SET_SYSTEM_THEME', payload: e.matches });
    };

    // Set initial system theme
    dispatch({ type: 'SET_SYSTEM_THEME', payload: mediaQuery.matches });

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
    localStorage.setItem('themeMode', mode);
  };

  // Determine if dark mode should be active
  const isDarkMode = state.mode === 'dark' || (state.mode === 'system' && state.isDark);
  
  const theme = createAppTheme(isDarkMode);

  const contextValue: ThemeContextType = {
    state: { ...state, isDark: isDarkMode },
    setThemeMode,
    theme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};