import { buttonClasses } from '@mui/material/Button';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React from 'react';

const theme = createTheme({
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          [`&.${buttonClasses.disabled}`]: {
            opacity: 0.5,
          },
        },
      },
    },
  },
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
