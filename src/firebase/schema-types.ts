// NOTE: make sure these types are aligned with firebase type checking rules in firestore.rules!

import firebase from '~/utils/firebase';

type FbDate = Date | firebase.firestore.Timestamp | firebase.firestore.FieldValue;

// extends the type with properties that is needed for client operations (such as id)
export type LocalModel<T> = T & { id: string };

export declare interface User {
  networkId?: string;
  bio?: string;
  createdAt: FbDate;
}

export declare interface Network {
  name: string;
  logoURL?: string;
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
  startTime?: FbDate;
  durationMin?: number;
  presentationId?: string;
  noteId?: string;
  chatId?: string;
  transcriptId?: string;
  createdAt: FbDate;
}

export declare interface Note {
  text: string;
}

export declare interface Presentation {
  name: string;
  creatorId: string;
  networkId?: string;
  slides: string[];
  isProcessed: boolean;
  createdAt: FbDate;
}
