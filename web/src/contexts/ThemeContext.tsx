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
        main: isDark ? '#6BB9F0' : '#4A90E2',
        light: isDark ? '#9CCFF7' : '#7BB3E8',
        dark: isDark ? '#4A9AE1' : '#3A7BC8',
      },
      secondary: {
        main: '#50E3C2',
        light: '#7EEBD4',
        dark: '#3DD4B0',
      },
      error: {
        main: isDark ? '#EF5350' : '#D0021B',
        light: isDark ? '#F28B8B' : '#E53E3E',
        dark: isDark ? '#C62828' : '#B91C1C',
      },
      warning: {
        main: isDark ? '#FFCA28' : '#F5A623',
        light: isDark ? '#FFD54F' : '#F7B955',
        dark: isDark ? '#FFA000' : '#D4941E',
      },
      info: {
        main: isDark ? '#4FC3F7' : '#6BB9F0',
        light: isDark ? '#81D4FA' : '#9CCFF7',
        dark: isDark ? '#29B6F6' : '#4A9AE1',
      },
      success: {
        main: isDark ? '#8BC34A' : '#7ED321',
        light: isDark ? '#AED581' : '#A3E635',
        dark: isDark ? '#689F38' : '#65A30D',
      },
      background: {
        default: isDark ? '#121212' : '#F8F9FA',
        paper: isDark ? '#1E1E1E' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#E0E0E0' : '#333333',
        secondary: isDark ? '#A0A0A0' : '#9E9E9E',
      },
      divider: isDark ? '#3A3A3A' : '#E0E0E0',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
        selected: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        disabled: isDark ? 'rgba(255, 255, 255, 0.26)' : 'rgba(0, 0, 0, 0.26)',
        disabledBackground: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.025em',
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.025em',
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.02em',
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.02em',
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
        fontSize: '1.125rem',
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: '1rem',
      },
      subtitle2: {
        fontWeight: 500,
        fontSize: '0.875rem',
      },
      body1: {
        fontWeight: 400,
        lineHeight: 1.6,
        fontSize: '1rem',
      },
      body2: {
        fontWeight: 400,
        lineHeight: 1.5,
        fontSize: '0.875rem',
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
        letterSpacing: '0.01em',
        fontSize: '0.875rem',
      },
    },
    shape: {
      borderRadius: 8,
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
            backgroundColor: isDark ? '#121212' : '#F8F9FA',
            transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          },
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: isDark ? '#3A3A3A #1E1E1E' : '#E0E0E0 #F8F9FA',
          },
          '*::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '*::-webkit-scrollbar-track': {
            background: isDark ? '#1E1E1E' : '#F8F9FA',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: isDark ? '#3A3A3A' : '#E0E0E0',
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: isDark ? '#4A4A4A' : '#CCCCCC',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 8,
            padding: '8px 16px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'none',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: isDark 
                ? '0 4px 12px rgba(107, 185, 240, 0.25)' 
                : '0 4px 12px rgba(74, 144, 226, 0.25)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isDark 
                ? '0 6px 16px rgba(107, 185, 240, 0.3)' 
                : '0 6px 16px rgba(74, 144, 226, 0.3)',
            },
          },
          outlined: {
            borderWidth: 1.5,
            '&:hover': {
              borderWidth: 1.5,
              backgroundColor: isDark 
                ? 'rgba(107, 185, 240, 0.08)' 
                : 'rgba(74, 144, 226, 0.08)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderRadius: 12,
            border: isDark ? '1px solid #3A3A3A' : '1px solid #E0E0E0',
            boxShadow: isDark 
              ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
              : '0 2px 8px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundImage: 'none',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDark 
                ? '0 8px 24px rgba(0, 0, 0, 0.4)' 
                : '0 8px 24px rgba(0, 0, 0, 0.12)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: isDark ? '#E0E0E0' : '#333333',
            boxShadow: 'none',
            borderBottom: isDark 
              ? '1px solid rgba(58, 58, 58, 0.5)' 
              : '1px solid rgba(224, 224, 224, 0.5)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderRight: isDark 
              ? '1px solid #3A3A3A' 
              : '1px solid #E0E0E0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '2px 8px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&.Mui-selected': {
              backgroundColor: isDark ? '#6BB9F0' : '#4A90E2',
              color: '#FFFFFF',
              boxShadow: isDark 
                ? '0 2px 8px rgba(107, 185, 240, 0.3)' 
                : '0 2px 8px rgba(74, 144, 226, 0.3)',
              '&:hover': {
                backgroundColor: isDark ? '#4A9AE1' : '#3A7BC8',
                transform: 'scale(1.02)',
              },
              '& .MuiListItemIcon-root': {
                color: '#FFFFFF',
              },
              '& .MuiListItemText-primary': {
                fontWeight: 600,
              },
            },
            '&:hover': {
              backgroundColor: isDark 
                ? 'rgba(107, 185, 240, 0.08)' 
                : 'rgba(74, 144, 226, 0.08)',
              transform: 'translateX(4px)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDark ? '#282828' : '#FFFFFF',
              borderRadius: 8,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '& fieldset': {
                borderColor: isDark ? '#3A3A3A' : '#E0E0E0',
                borderWidth: 1.5,
              },
              '&:hover fieldset': {
                borderColor: isDark ? '#4A4A4A' : '#CCCCCC',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDark ? '#6BB9F0' : '#4A90E2',
                borderWidth: 2,
                boxShadow: isDark 
                  ? '0 0 0 3px rgba(107, 185, 240, 0.1)' 
                  : '0 0 0 3px rgba(74, 144, 226, 0.1)',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDark ? '#A0A0A0' : '#9E9E9E',
              '&.Mui-focused': {
                color: isDark ? '#6BB9F0' : '#4A90E2',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#282828' : '#F0F2F5',
            color: isDark ? '#E0E0E0' : '#333333',
            borderRadius: 6,
            fontWeight: 500,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: isDark ? '#3A3A3A' : '#E0E0E0',
              transform: 'scale(1.05)',
            },
          },
          outlined: {
            borderColor: isDark ? '#3A3A3A' : '#E0E0E0',
            backgroundColor: 'transparent',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#6BB9F0' : '#4A90E2',
            color: '#FFFFFF',
            fontWeight: 600,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: isDark 
                ? '0 4px 12px rgba(107, 185, 240, 0.3)' 
                : '0 4px 12px rgba(74, 144, 226, 0.3)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
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
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderRadius: 12,
            border: isDark ? '1px solid #3A3A3A' : '1px solid #E0E0E0',
            boxShadow: isDark 
              ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
              : '0 2px 8px rgba(0, 0, 0, 0.06)',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#282828' : '#F0F2F5',
            '& .MuiTableCell-head': {
              backgroundColor: 'transparent',
              color: isDark ? '#E0E0E0' : '#333333',
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
            borderRadius: 8,
            border: 'none',
            boxShadow: isDark 
              ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
              : '0 2px 8px rgba(0, 0, 0, 0.1)',
          },
          standardSuccess: {
            backgroundColor: isDark ? 'rgba(139, 195, 74, 0.15)' : 'rgba(126, 211, 33, 0.1)',
            color: isDark ? '#8BC34A' : '#7ED321',
          },
          standardError: {
            backgroundColor: isDark ? 'rgba(239, 83, 80, 0.15)' : 'rgba(208, 2, 27, 0.1)',
            color: isDark ? '#EF5350' : '#D0021B',
          },
          standardWarning: {
            backgroundColor: isDark ? 'rgba(255, 202, 40, 0.15)' : 'rgba(245, 166, 35, 0.1)',
            color: isDark ? '#FFCA28' : '#F5A623',
          },
          standardInfo: {
            backgroundColor: isDark ? 'rgba(79, 195, 247, 0.15)' : 'rgba(107, 185, 240, 0.1)',
            color: isDark ? '#4FC3F7' : '#6BB9F0',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderRadius: 16,
            border: isDark ? '1px solid #3A3A3A' : '1px solid #E0E0E0',
            boxShadow: isDark 
              ? '0 16px 32px rgba(0, 0, 0, 0.5)' 
              : '0 16px 32px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#3A3A3A' : '#E0E0E0',
              borderWidth: 1.5,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#4A4A4A' : '#CCCCCC',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#6BB9F0' : '#4A90E2',
              borderWidth: 2,
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderRadius: 8,
            border: isDark ? '1px solid #3A3A3A' : '1px solid #E0E0E0',
            boxShadow: isDark 
              ? '0 8px 24px rgba(0, 0, 0, 0.4)' 
              : '0 8px 24px rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 6,
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
                color: '#FFFFFF',
                '& + .MuiSwitch-track': {
                  backgroundColor: isDark ? '#6BB9F0' : '#4A90E2',
                  opacity: 1,
                },
              },
            },
            '& .MuiSwitch-track': {
              backgroundColor: isDark ? '#3A3A3A' : '#E0E0E0',
              opacity: 1,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              minHeight: 48,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: isDark 
                  ? 'rgba(107, 185, 240, 0.08)' 
                  : 'rgba(74, 144, 226, 0.08)',
              },
              '&.Mui-selected': {
                color: isDark ? '#6BB9F0' : '#4A90E2',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: isDark ? '#6BB9F0' : '#4A90E2',
              height: 3,
              borderRadius: '3px 3px 0 0',
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