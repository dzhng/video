import { useCallback, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { TOKEN_ENDPOINT } from '~/constants';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export default function useFirebaseAuth() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const getToken = useCallback(
    async (identity: string, roomName: string) => {
      const idToken = await user!.getIdToken();
      const params = JSON.stringify({ identity, roomName, idToken });

      return fetch(`${TOKEN_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: params,
      }).then((res) => res.text());
    },
    [user],
  );

  useEffect(() => {
    if (!firebase.apps?.length) {
      firebase.initializeApp(firebaseConfig);
      firebase.auth().onAuthStateChanged((newUser) => {
        setUser(newUser);
        setIsAuthReady(true);
      });
    }
  }, []);

  const signIn = useCallback(async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');

    const ret = await firebase.auth().signInWithPopup(provider);
    setUser(ret.user);
  }, []);

  const signOut = useCallback(async () => {
    await firebase.auth().signOut();
    setUser(null);
  }, []);

  return { user, signIn, signOut, isAuthReady, getToken };
}
