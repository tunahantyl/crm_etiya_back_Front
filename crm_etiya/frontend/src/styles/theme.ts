import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a237e',
      light: '#3949ab',
      dark: '#0d164f',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#00bfa6',
      light: '#40d5c1',
      dark: '#008674',
      contrastText: '#0a0e1a'
    },
    background: {
      default: '#f4f6fb',
      paper: '#ffffff'
    },
    text: {
      primary: '#0a0e1a',
      secondary: '#4b5563'
    },
    success: {
      main: '#22c55e'
    },
    warning: {
      main: '#f59e0b'
    },
    error: {
      main: '#ef4444'
    },
    divider: 'rgba(2,6,23,0.08)'
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif'
    ].join(', '),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.7 }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f4f6fb',
          backgroundImage:
            'radial-gradient(1000px 400px at 10% -20%, rgba(26,35,126,0.08), transparent), radial-gradient(800px 300px at 90% -10%, rgba(0,191,166,0.08), transparent)',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(2, 6, 23, 0.06)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 12px 30px rgba(2, 6, 23, 0.06)'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #ffffff 0%, #f9fbff 100%)',
          color: '#0a0e1a'
        }
      }
    },
    // @ts-ignore - MUI X component key
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
        }
      }
    }
  }
});

export default theme;


