// NOTE: make sure these types are aligned with firebase type checking rules in firestore.rules!

export declare interface User {
  networkId?: string;
  bio?: string;
  createdAt: Date;
}

export declare interface Network {
  name: string;
  logoURL?: string;
  primaryColor?: string;
  createdAt: Date;
}

export declare interface Admin {
  role: 'owner' | 'admin';
  createdAt: string;
}

export declare interface Call {
  name: string;
  state: 'pre' | 'started' | 'finished';
  participants?: string[];
  externalEmails?: string[];
  startTime?: Date;
  durationMin?: number;
  presentationId?: string;
  noteId?: string;
  chatId?: string;
  transcriptId?: string;
  createdAt: Date;
}
