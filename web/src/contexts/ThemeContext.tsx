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
      error: {
        main: '#FF3B30',
        light: '#FF6B5A',
        dark: '#D70015',
      },
      warning: {
        main: '#FF9500',
        light: '#FFB340',
        dark: '#CC7700',
      },
      info: {
        main: '#5AC8FA',
        light: '#7DD3FC',
        dark: '#0891B2',
      },
      success: {
        main: '#34C759',
        light: '#5DD87A',
        dark: '#28A745',
      },
      background: {
        default: isDark ? '#000000' : '#f8f9fa',
        paper: isDark ? '#1c1c1e' : '#ffffff',
      },
      text: {
        primary: isDark ? '#ffffff' : '#1d1d1f',
        secondary: isDark ? '#98989d' : '#6c757d',
      },
      divider: isDark ? '#38383a' : '#d2d2d7',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
        selected: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        disabled: isDark ? 'rgba(255, 255, 255, 0.26)' : 'rgba(0, 0, 0, 0.26)',
        disabledBackground: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      subtitle1: {
        fontWeight: 500,
      },
      subtitle2: {
        fontWeight: 500,
      },
      body1: {
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontWeight: 400,
        lineHeight: 1.43,
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
        letterSpacing: '0.01em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#000000' : '#f8f9fa',
            transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 10,
            padding: '10px 20px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: isDark 
                ? '0 8px 25px rgba(0, 122, 255, 0.3)' 
                : '0 8px 25px rgba(0, 122, 255, 0.2)',
            },
          },
          contained: {
            boxShadow: isDark 
              ? '0 4px 14px rgba(0, 122, 255, 0.25)' 
              : '0 4px 14px rgba(0, 122, 255, 0.15)',
            '&:hover': {
              boxShadow: isDark 
                ? '0 8px 25px rgba(0, 122, 255, 0.35)' 
                : '0 8px 25px rgba(0, 122, 255, 0.25)',
            },
          },
          outlined: {
            borderWidth: 1.5,
            '&:hover': {
              borderWidth: 1.5,
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.02)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
            borderRadius: 16,
            border: isDark ? '1px solid #38383a' : '1px solid #e5e5ea',
            boxShadow: isDark 
              ? '0 4px 20px rgba(0, 0, 0, 0.4)' 
              : '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundImage: 'none',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDark 
                ? '0 8px 30px rgba(0, 0, 0, 0.5)' 
                : '0 8px 30px rgba(0, 0, 0, 0.12)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: isDark ? '#ffffff' : '#1d1d1f',
            boxShadow: 'none',
            borderBottom: isDark 
              ? '1px solid rgba(56, 56, 58, 0.5)' 
              : '1px solid rgba(229, 229, 234, 0.5)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
            borderRight: isDark 
              ? '1px solid #38383a' 
              : '1px solid #e5e5ea',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            margin: '2px 8px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&.Mui-selected': {
              backgroundColor: '#007AFF',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
              '&:hover': {
                backgroundColor: '#0056CC',
                transform: 'scale(1.02)',
              },
              '& .MuiListItemIcon-root': {
                color: '#ffffff',
              },
              '& .MuiListItemText-primary': {
                fontWeight: 600,
              },
            },
            '&:hover': {
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 122, 255, 0.05)',
              transform: 'translateX(4px)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDark ? '#2c2c2e' : '#ffffff',
              borderRadius: 12,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '& fieldset': {
                borderColor: isDark ? '#48484a' : '#d1d1d6',
                borderWidth: 1.5,
              },
              '&:hover fieldset': {
                borderColor: isDark ? '#636366' : '#a1a1aa',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#007AFF',
                borderWidth: 2,
                boxShadow: isDark 
                  ? '0 0 0 3px rgba(0, 122, 255, 0.1)' 
                  : '0 0 0 3px rgba(0, 122, 255, 0.1)',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDark ? '#98989d' : '#6c757d',
              '&.Mui-focused': {
                color: '#007AFF',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7',
            color: isDark ? '#ffffff' : '#1d1d1f',
            borderRadius: 8,
            fontWeight: 500,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: isDark ? '#3a3a3c' : '#e5e5ea',
              transform: 'scale(1.05)',
            },
          },
          outlined: {
            borderColor: isDark ? '#48484a' : '#d1d1d6',
            backgroundColor: 'transparent',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: '#007AFF',
            color: '#ffffff',
            fontWeight: 600,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.04)',
              transform: 'scale(1.1)',
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
            borderRadius: 16,
            border: isDark ? '1px solid #38383a' : '1px solid #e5e5ea',
            boxShadow: isDark 
              ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
              : '0 4px 20px rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7',
            '& .MuiTableCell-head': {
              backgroundColor: 'transparent',
              color: isDark ? '#ffffff' : '#1d1d1f',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '0.01em',
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.03)' 
                : 'rgba(0, 0, 0, 0.02)',
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: 'none',
            boxShadow: isDark 
              ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
              : '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          standardSuccess: {
            backgroundColor: isDark ? 'rgba(52, 199, 89, 0.15)' : 'rgba(52, 199, 89, 0.1)',
            color: isDark ? '#34C759' : '#28A745',
          },
          standardError: {
            backgroundColor: isDark ? 'rgba(255, 59, 48, 0.15)' : 'rgba(255, 59, 48, 0.1)',
            color: isDark ? '#FF3B30' : '#D70015',
          },
          standardWarning: {
            backgroundColor: isDark ? 'rgba(255, 149, 0, 0.15)' : 'rgba(255, 149, 0, 0.1)',
            color: isDark ? '#FF9500' : '#CC7700',
          },
          standardInfo: {
            backgroundColor: isDark ? 'rgba(90, 200, 250, 0.15)' : 'rgba(90, 200, 250, 0.1)',
            color: isDark ? '#5AC8FA' : '#0891B2',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
            borderRadius: 20,
            border: isDark ? '1px solid #38383a' : '1px solid #e5e5ea',
            boxShadow: isDark 
              ? '0 20px 40px rgba(0, 0, 0, 0.5)' 
              : '0 20px 40px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#48484a' : '#d1d1d6',
              borderWidth: 1.5,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#636366' : '#a1a1aa',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#007AFF',
              borderWidth: 2,
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
            borderRadius: 12,
            border: isDark ? '1px solid #38383a' : '1px solid #e5e5ea',
            boxShadow: isDark 
              ? '0 8px 30px rgba(0, 0, 0, 0.4)' 
              : '0 8px 30px rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '2px 8px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.04)',
              transform: 'scale(1.02)',
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .MuiSwitch-switchBase': {
              '&.Mui-checked': {
                color: '#ffffff',
                '& + .MuiSwitch-track': {
                  backgroundColor: '#34C759',
                  opacity: 1,
                },
              },
            },
            '& .MuiSwitch-track': {
              backgroundColor: isDark ? '#48484a' : '#d1d1d6',
              opacity: 1,
            },
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