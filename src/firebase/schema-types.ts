// NOTE: make sure these types are aligned with firebase type checking rules in firestore.rules!

import firebase from '~/utils/firebase';

export enum Collections {
  USERS = 'users',
  TEMPLATES = 'templates',
  CALLS = 'calls',
  PRESENTATIONS = 'presentations',
  WORKSPACES = 'workspaces',
  MEMBERS = 'members', // this is a subcollection of workspaces
  INVITES = 'invites', // this is a subcollection of workspaces
}

export type FbDate = Date | firebase.firestore.Timestamp | firebase.firestore.FieldValue;

// extends the type with properties that is needed for client operations (such as id)
// becareful with this in components that deal with saving because it is very easy to get into a situation where you end up saving data that's extended for local, which would be rejected on server.
export type LocalModel<T> = T & { id: string };

export declare interface User {
  displayName: string;
  email?: string | null;
  photoURL?: string | null;
  bio?: string | null;
  defaultWorkspaceId?: string;
}

export declare interface Workspace {
  name: string;
  logoURL?: string | null;
  primaryColor?: string | null;
  backgroundColor?: string | null;
  isDeleted?: boolean;
  createdAt: FbDate;
}

export type MemberRoles = 'owner' | 'member' | 'deleted';

export declare interface Member {
  memberId: string;
  role: MemberRoles;
  createdAt: FbDate;
}

export declare interface Invite {
  email: string;
  isProcessed?: boolean;
  createdAt: FbDate;
}

export type ActivityTypes = 'video' | 'presentation' | 'poll' | 'qa' | 'screenshare' | 'breakout';

export declare interface Activity {
  id: string;
  type: ActivityTypes;
  // metadata changes depending on activity types
  metadata:
    | PresentationActivityMetadata
    | VideoActivityMetadata
    | PollActivityMetadata
    | QuestionsActivityMetadata
    | ScreenShareActivityMetadata
    | BreakoutActivityMetadata;
}

export declare interface Template {
  name: string;
  creatorId: string;
  workspaceId: string | null;
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
  workspaceId: string | null;
  slides: string[];
  isProcessed?: boolean;
  createdAt: FbDate;
}

// Activity type metadata schemas
export declare interface PresentationActivityMetadata {
  presentationId: string;
}

export declare interface VideoActivityMetadata {
  videoId: string;
}

export declare interface PollActivityMetadata {}

export declare interface QuestionsActivityMetadata {}

export declare interface ScreenShareActivityMetadata {
  hostOnly: boolean;
}

export declare interface BreakoutActivityMetadata {}
