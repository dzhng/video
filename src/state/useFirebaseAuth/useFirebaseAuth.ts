import { useCallback, useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import firebase, { auth } from '~/utils/firebase';
import { TWILIO_TOKEN_ENDPOINT } from '~/constants';

export default function useFirebaseAuth() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((newUser) => {
      setUser(newUser);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, []);

  // fetch twilio token for call from internal endpoint (which talks to twilio admin API)
  const getToken = useCallback(
    async (roomName: string) => {
      const idToken = await user!.getIdToken();
      const params = JSON.stringify({ idToken, roomName });

      return fetch(`${TWILIO_TOKEN_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: params,
      }).then((res) => res.text());
    },
    [user],
  );

  const signIn = useCallback(async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');

    const ret = await auth.signInWithPopup(provider);
    setUser(ret.user);
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, []);

  return { user, signIn, signOut, isAuthReady, getToken };
}
