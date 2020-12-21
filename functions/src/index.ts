import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import fetch from 'isomorphic-unfetch';
import { words, capitalize } from 'lodash';

admin.initializeApp();

// HACKY:
// redeclare schemas here, since we can't import from parent project (cause compile issues)
// eslint-disable-next-line no-shadow
export enum Collections {
  USERS = 'users',
  TEMPLATES = 'templates',
  CALLS = 'calls',
  PRESENTATIONS = 'presentations',
  WORKSPACES = 'workspaces',
  ADMINS = 'admins', // this is a subcollection of workspaces
}

interface Presentation {
  slides: string[];
  isProcessed: boolean;
}

export declare interface User {
  workspaceIds: string[];
}

export declare interface Workspace {
  name: string;
  createdAt: admin.firestore.FieldValue;
}

export declare interface Admin {
  role: 'owner' | 'admin';
  createdAt: admin.firestore.FieldValue;
}

// TODO: test this
export const processPresentation = functions
  .region('europe-west1')
  .firestore.document(`${Collections.PRESENTATIONS}/{presentationId}`)
  .onCreate(async (snap, context) => {
    const doc = snap.data() as Presentation;
    if (doc.isProcessed) {
      return;
    }

    const bucket = admin.storage().bucket();

    // first download all slides for uploading into storage
    const responses: Response[] = await Promise.all<Response>(
      doc.slides.map((slide) => fetch(slide)),
    );
    const buffers: ArrayBuffer[] = await Promise.all(
      responses.map((response) => response.arrayBuffer()),
    );

    // next upload all downloaded files into storage, returning an array of storage paths
    const paths: string[] = await Promise.all(
      buffers.map(async (buffer, idx) => {
        const path = `${Collections.PRESENTATIONS}/${context.params.presentationId}/${idx}`;
        const file = bucket.file(path);
        await file.save(Buffer.from(buffer), {
          resumable: false,
          contentType: responses[idx].headers.get('content-type') ?? undefined,
        });
        return path;
      }),
    );

    // last, update original doc
    return snap.ref.update({ slides: paths });
  });

// TODO: test this
export const createDefaultUserRecords = functions
  .region('europe-west1')
  .auth.user()
  .onCreate(async (user) => {
    const store = admin.firestore();
    const firstName = user.displayName ? capitalize(words(user.displayName)[0]) : null;

    const batch = store.batch();

    const workspaceData = {
      name: firstName ? `${firstName}'s Workspace` : 'My Workspace',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    } as Workspace;
    const workspaceRef = store.collection(Collections.WORKSPACES).doc();
    batch.set(workspaceRef, workspaceData);

    const userData = {
      workspaceIds: [workspaceRef.id],
    } as User;
    // share same uid as auth user record
    const userRef = store.collection(Collections.USERS).doc(user.uid);
    batch.set(userRef, userData);

    const adminData = {
      role: 'owner',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    } as Admin;
    // share the same uid as auth user record
    const adminRef = workspaceRef.collection(Collections.ADMINS).doc(user.uid);
    batch.set(adminRef, adminData);

    await batch.commit();
  });
