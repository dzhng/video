import firebase from '~/utils/firebase';
import { useCallback } from 'react';

declare global {
  interface Window {
    Intercom(command: string, arg?: any): void;
  }
}

export default function useIntercom() {
  const boot = useCallback((user: firebase.User) => {
    if (user) {
      window.Intercom('boot', {
        app_id: 'w0k8mz0m',
        user_id: user.uid,
        email: user.email,
        name: user.displayName,
      });
    }
  }, []);

  const shutdown = useCallback(() => {
    window.Intercom('shutdown');
  }, []);

  const showLauncher = useCallback((show: boolean) => {
    window.Intercom('update', {
      hide_default_launcher: !show,
    });
  }, []);

  return { boot, shutdown, showLauncher };
}
