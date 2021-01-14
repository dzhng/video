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

  const signIn = useCallback(async () => {
    // if already signed in, sign out first
    if (user) {
      await auth.signOut();
      setUser(null);
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    const ret = await auth.signInWithPopup(provider);
    setUser(ret.user);
    return ret.user;
  }, [user]);

  const signInAnonymously = useCallback(async (displayName: string) => {
    const ret = await auth.signInAnonymously();
    // TODO: not sure if anonymous accounts supports display names, it's not being set locally right away after updating profile. Need to test this.
    await ret.user?.updateProfile({
      displayName,
    });

    setUser(ret.user);
    return ret.user;
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, []);

  return { user, signIn, signInAnonymously, signOut, isAuthReady, getToken };
}
