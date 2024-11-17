import { createTheme } from '@mui/material/styles';

const ClaudeTheme = createTheme({
/*
 dark blue #0F3C59
 light blue #80BDBF
 lighter blue #B7D7D7
 orange #F29621
 salmon #F05849
*/
  palette: {
    background: {
      default: '#f7f7f7', // Main background color for your pages
      paper: '#ffffff',   // Background color for Paper components
    },
    primary: {
      //main: '#007bff',    // Primary color for your components
      main: '#FA8400',    ///orange
    },
    secondary: {
      main: '#ff4081',    // Secondary color for accent elements . this is pink for some reason
    },
    text: {
      primary: '#333333', // Main text color
      secondary: '#0F3C59'           //'#0D0D0D' 
    },
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
        },
      },
    },
  },
});

export default ClaudeTheme;