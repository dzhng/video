import admin from 'firebase-admin';

// HACKY:
// redeclare schemas here, since we can't import from parent project (cause compile issues)
// eslint-disable-next-line no-shadow
export enum Collections {
  USERS = 'users',
  TEMPLATES = 'templates',
  CALLS = 'calls',
  PRESENTATIONS = 'presentations',
  WORKSPACES = 'workspaces',
  MEMBERS = 'members', // this is a subcollection of workspaces
}

export declare interface Presentation {
  slides: string[];
  isProcessed?: boolean;
}

export declare interface User {
  displayName: string;
  email?: string | null;
  photoURL?: string | null;
  bio?: string | null;
  defaultWorkspaceId?: string;
}

export declare interface Workspace {
  name: string;
  isDeleted?: boolean;
  createdAt: admin.firestore.FieldValue;
}

export declare interface Member {
  memberId: string;
  role: 'owner' | 'member' | 'deleted';
  createdAt: admin.firestore.FieldValue;
}

export declare interface Call {
  templateId: string;
  creatorId: string;
  currentStep: number;
  stepData: object;
  isFinished?: boolean;
  duration?: number;
  createdAt: admin.firestore.FieldValue;
}
