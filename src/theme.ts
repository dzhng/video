import { createMuiTheme } from '@material-ui/core';
import type {} from '@material-ui/lab/themeAugmentation';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sidebarWidth: number;
    sidebarMobileHeight: number;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sidebarWidth?: number;
    sidebarMobileHeight?: number;
  }
}

export default createMuiTheme({
  palette: {
    type: 'light',
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    // for main page title
    h1: {
      fontSize: '1.4rem',
      fontWeight: 400,
    },
    // main navigation title
    h2: {
      fontSize: '1.1rem',
      fontWeight: 400,
    },
    // navigation item text
    h3: {
      fontSize: '1.0rem',
      fontWeight: 400,
    },
    // navigation item text (small)
    h4: {
      fontSize: '0.95rem',
      fontWeight: 400,
    },
    // section labels
    h5: {
      fontSize: '0.9rem',
      fontWeight: 400,
    },
    // section labels (small)
    h6: {
      fontSize: '0.9rem',
      fontWeight: 300,
    },
    // main body / selection text
    body1: {
      fontSize: '0.9rem',
      fontWeight: 400,
    },
    // descriptions
    body2: {
      fontSize: '0.8rem',
      fontWeight: 400,
    },
    button: {
      fontSize: '0.8rem',
    },
  },
  overrides: {
    MuiTooltip: {
      arrow: {
        backgroundColor: 'black',
      },
      tooltip: {
        backgroundColor: 'black',
      },
    },
  },

  // custom
  sidebarWidth: 260,
  sidebarMobileHeight: 90,
});
