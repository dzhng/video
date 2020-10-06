import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import AppStateProvider from '~/state';
import LoginPage from '~/components/LoginPage/LoginPage';
import PrivateRoute from '~/components/PrivateRoute/PrivateRoute';
import '~/types';

import { useAppState } from '~/state';
import ErrorDialog from '~/components/ErrorDialog/ErrorDialog';
import { VideoProvider } from '~/components/VideoProvider';
import useConnectionOptions from '~/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import Room from '~/Room';

const Video = () => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <Room />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
};

export default function App() {
  return (
    <Router>
      <AppStateProvider>
        <Switch>
          <PrivateRoute exact path="/">
            <Video />
          </PrivateRoute>
          <PrivateRoute path="/room/:URLRoomName">
            <Video />
          </PrivateRoute>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Redirect to="/" />
        </Switch>
      </AppStateProvider>
    </Router>
  );
}
