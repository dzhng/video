import { createMuiTheme } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import type {} from '@material-ui/lab/themeAugmentation';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    headerBarHeight: number;
    transitionTime: string;
    dividerBorder: string;

    customMixins: {
      modalPaper: CSSProperties;
      activitiesBar: CSSProperties;
      activitiesBarMini: CSSProperties;
      callButton: CSSProperties;
      scrollBar: CSSProperties;
    };
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    headerBarHeight?: number;
    transitionTime?: string;
    dividerBorder?: string;

    customMixins: {
      modalPaper?: CSSProperties;
      activitiesBar?: CSSProperties;
      activitiesBarMini?: CSSProperties;
      callButton?: CSSProperties;
      scrollBar?: CSSProperties;
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
    // for hero text
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
  headerBarHeight: 65,
  transitionTime: '0.3s',
  dividerBorder: '1px solid rgba(0, 0, 0, 0.12)',

  customMixins: {
    modalPaper: {
      width: '90%',
      maxWidth: 600,
    },
    activitiesBar: {
      maxWidth: 500,
      minWidth: 325,
      width: '33%',
      flexShrink: 0,
    },
    activitiesBarMini: {
      maxWidth: 500,
      minWidth: 325,
      width: '25%',
      flexShrink: 0,
    },
    callButton: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    },
    scrollBar: {
      // scroll bar customization
      '&::-webkit-scrollbar': {
        width: 8,
      },
      '&::-webkit-scrollbar-track': {
        background: 'none',
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: 4,
        background: 'rgba(0,0,0,0.2)',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(0,0,0,0.4)',
      },
    },
  },
});
