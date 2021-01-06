import { createMuiTheme } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import type {} from '@material-ui/lab/themeAugmentation';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    modalWidth: number;
    headerBarHeight: number;
    transitionTime: string;
    dividerBorder: string;

    customMixins: {
      activitiesBar: CSSProperties;
      activitiesBarMini: CSSProperties;
      callButton: CSSProperties;
    };
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    modalWidth?: number;
    headerBarHeight?: number;
    transitionTime?: string;
    dividerBorder?: string;

    customMixins: {
      activitiesBar?: CSSProperties;
      activitiesBarMini?: CSSProperties;
      callButton?: CSSProperties;
    };
  }
}

// colors:
// Primary is for main actions
// Secondary is for host or moderation related actions

export default createMuiTheme({
  shape: {
    borderRadius: 6,
  },
  palette: {
    type: 'light',
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
  // reduce z-index for everything so libs like nprogress will still work (nprogress is 1031)
  zIndex: {
    mobileStepper: 100,
    speedDial: 105,
    appBar: 110,
    drawer: 120,
    modal: 130,
    snackbar: 140,
    tooltip: 150,
  },

  // custom
  modalWidth: 600,
  headerBarHeight: 65,
  transitionTime: '0.3s',
  dividerBorder: '1px solid rgba(0, 0, 0, 0.12)',

  customMixins: {
    activitiesBar: {
      maxWidth: 500,
      minWidth: 325,
      width: '33%',
    },
    activitiesBarMini: {
      maxWidth: 500,
      minWidth: 300,
      width: '25%',
    },
    callButton: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    },
  },
});
