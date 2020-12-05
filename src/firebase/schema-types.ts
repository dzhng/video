// NOTE: make sure these types are aligned with firebase type checking rules in firestore.rules!

export declare interface User {
  id?: string;
  networkId?: string;
  bio?: string;
  createdAt: Date;
}

export declare interface Network {
  id?: string;
  name: string;
  logoURL?: string;
  primaryColor?: string;
  createdAt: Date;
}

export declare interface Admin {
  id?: string;
  role: 'owner' | 'admin';
  createdAt: string;
}

export declare interface Call {
  id?: string;
  name: string;
  state: 'pre' | 'started' | 'finished';
  creatorId: string;
  users: string[];
  guests?: string[];
  guestEmails?: string[];
  startTime?: Date;
  durationMin?: number;
  presentationId?: string;
  noteId?: string;
  chatId?: string;
  transcriptId?: string;
  createdAt: Date;
}

export declare interface Note {
  id?: string;
  text: string;
}

export declare interface Presentation {
  id?: string;
  name: string;
  creatorId: string;
  networkId?: string;
  createdAt: Date;
}
