import { useEffect, useCallback } from 'react';
import { useAppState } from '~/state';

declare global {
  interface Window {
    Intercom(command: string, arg?: any): void;
  }
}

export default function useIntercom() {
  const { user, isAuthReady, userRecord } = useAppState();

  useEffect(() => {
    if (userRecord && user) {
      window.Intercom('boot', {
        app_id: 'w0k8mz0m',
        user_id: user.uid,
        name: userRecord.displayName,
        email: userRecord.email,
      });
    } else {
      // if auth is ready and there are no record, means logged out
      if (isAuthReady) {
        window.Intercom('shutdown');
      }
    }
  }, [userRecord, user, isAuthReady]);

  const showLauncher = useCallback((show: boolean) => {
    window.Intercom('update', {
      hide_default_launcher: !show,
    });
  }, []);

  return { showLauncher };
}
