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
  // TODO: move this to another file that's not firebase related
  const getToken = useCallback(
    async (roomName: string): Promise<string> => {
      if (!user) {
        return Promise.reject('User is not authenticated');
      }

      const idToken = await user.getIdToken();
      const params = JSON.stringify({ idToken, roomName });

      const res = await fetch(`${TWILIO_TOKEN_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: params,
      });

      return res.text();
    },
    [user],
  );

  const signIn = useCallback(
    async (email, password) => {
      // if already signed in, sign out first
      if (user) {
        await auth.signOut();
        setUser(null);
      }

      const ret = await auth.signInWithEmailAndPassword(email, password);
      setUser(ret.user);
      return ret.user;
    },
    [user],
  );

  const signInAnonymously = useCallback(async () => {
    const ret = await auth.signInAnonymously();
    setUser(ret.user);
    return ret.user;
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, []);

  const register = useCallback(async (email, password) => {
    const ret = await auth.createUserWithEmailAndPassword(email, password);
    setUser(ret.user);
    return ret;
  }, []);

  return { user, signIn, signInAnonymously, signOut, isAuthReady, getToken, register };
}
