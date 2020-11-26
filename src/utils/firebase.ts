import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config =
  process.env.NODE_ENV === 'test'
    ? {
        projectId: 'fake-project-id',
        apiKey: 'fake-api-key-for-testing-purposes-only',
      }
    : {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      };

if (!firebase.apps?.length) {
  firebase.initializeApp(config);
}

const db = firebase.firestore();
const auth = firebase.auth();

if (process.env.NODE_ENV === 'test') {
  db.useEmulator('localhost', 8080);
  auth.useEmulator('http://localhost:9099');
} else {
  // enable on non-testing version only
  db.enablePersistence({ synchronizeTabs: true }).catch(function (err) {
    if (err.code === 'failed-precondition') {
      console.warn('Disabling cache due to multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Disabling cache due to browser version');
    }
  });
}

export default firebase;
export { db, auth };
