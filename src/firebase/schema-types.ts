// NOTE: make sure these types are aligned with firebase type checking rules in firestore.rules!

import firebase from '~/utils/firebase';

type FbDate = firebase.firestore.Timestamp | firebase.firestore.FieldValue;

// extends the type with properties that is needed for client operations (such as id)
// becareful with this in components that deal with saving because it is very easy to get into a situation where you end up saving data that's extended for local, which would be rejected on server.
export type LocalModel<T> = T & { id: string };

export declare interface User {
  networkId?: string | null;
  bio?: string;
  createdAt: FbDate;
}

export declare interface Network {
  name: string;
  logoURL?: string | null;
  primaryColor?: string;
  createdAt: FbDate;
}

export declare interface Admin {
  role: 'owner' | 'admin';
  createdAt: FbDate;
}

export declare interface Call {
  name: string;
  state: 'pre' | 'started' | 'finished';
  creatorId: string;
  users: string[];
  guests?: string[];
  guestEmails?: string[];
  startTime?: FbDate | null;
  durationMin?: number;
  presentationId?: string | null;
  createdAt: FbDate;
}

export declare interface Note {
  text: string;
}

export declare interface Presentation {
  name: string;
  creatorId: string;
  networkId?: string | null;
  slides: string[];
  isProcessed: boolean;
  createdAt: FbDate;
}
