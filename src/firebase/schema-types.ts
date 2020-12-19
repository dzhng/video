// NOTE: make sure these types are aligned with firebase type checking rules in firestore.rules!

import firebase from '~/utils/firebase';

export enum Collections {
  USERS = 'users',
  TEMPLATES = 'templates',
  CALLS = 'calls',
  PRESENTATIONS = 'presentations',
  WORKSPACES = 'workspaces',
  ADMINS = 'admins', // this is a subcollection of workspaces
}

export type FbDate = Date | firebase.firestore.Timestamp | firebase.firestore.FieldValue;

// extends the type with properties that is needed for client operations (such as id)
// becareful with this in components that deal with saving because it is very easy to get into a situation where you end up saving data that's extended for local, which would be rejected on server.
export type LocalModel<T> = T & { id: string };

export declare interface User {
  workspaceId?: string | null;
  bio?: string;
  createdAt: FbDate;
}

export declare interface Workspace {
  name: string;
  logoURL?: string | null;
  primaryColor?: string | null;
  backgroundColor?: string | null;
  createdAt: FbDate;
}

export declare interface Admin {
  role: 'owner' | 'admin';
  createdAt: FbDate;
}

export declare interface Activity {
  type: 'video' | 'presentaion';
  presentaionId?: string | null;
}

export declare interface Template {
  name: string;
  creatorId: string;
  workspaceId?: string | null;
  activities: Activity[];
  notes?: string;
  createdAt: FbDate;
}

export declare interface Call {
  templateId: string;
  creatorId: string;
  state: 'started' | 'finished';
  currentStep: number;
  stepData: object;
  notes?: string;
  createdAt: FbDate;
}

export declare interface Presentation {
  name: string;
  creatorId: string;
  workspaceId?: string | null;
  slides: string[];
  isProcessed: boolean;
  createdAt: FbDate;
}
