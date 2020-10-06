import dynamic from 'next/dynamic';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '~/theme';

// disable SSR on the video component itself, since it uses browser features
const App = dynamic(() => import('~/App'), { ssr: false });

export default () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </MuiThemeProvider>
);
