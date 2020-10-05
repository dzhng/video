import dynamic from 'next/dynamic';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { StaticRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import AppStateProvider from '~/state';
import LoginPage from '~/components/LoginPage/LoginPage';
import PrivateRoute from '~/components/PrivateRoute/PrivateRoute';
import theme from '~/theme';
import '~/types';

// disable SSR on the video component itself, since it uses browser features
const App = dynamic(() => import('~/App'), { ssr: false });

export default () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <AppStateProvider>
        <Switch>
          <PrivateRoute exact path="/">
            <App />
          </PrivateRoute>
          <PrivateRoute path="/room/:URLRoomName">
            <App />
          </PrivateRoute>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Redirect to="/" />
        </Switch>
      </AppStateProvider>
    </Router>
  </MuiThemeProvider>
);
