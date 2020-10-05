import { useCallback, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export default function useFirebaseAuth() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const getToken = useCallback(
    async (identity: string, roomName: string) => {
      const headers = new window.Headers();

      const idToken = await user!.getIdToken();
      headers.set('Authorization', idToken);

      const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';
      const params = new window.URLSearchParams({ identity, roomName });

      return fetch(`${endpoint}?${params}`, { headers }).then((res) => res.text());
    },
    [user],
  );

  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setIsAuthReady(true);
    });
  }, []);

  const signIn = useCallback(async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');

    const user = await firebase.auth().signInWithPopup(provider);
    setUser(user.user);
  }, []);

  const signOut = useCallback(async () => {
    await firebase.auth().signOut();
    setUser(null);
  }, []);

  return { user, signIn, signOut, isAuthReady, getToken };
}
