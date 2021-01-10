import * as functions from 'firebase-functions';
import 'firebase-functions';
import admin from 'firebase-admin';
import fetch from 'isomorphic-unfetch';
import { words, capitalize } from 'lodash';
import { Collections, Presentation, User, Workspace, Member } from './schema';
import { region } from './constants';

admin.initializeApp();

// TODO: test this
// This function needs extra memory to process slide images
export const processPresentation = functions
  .region(region)
  .runWith({ memory: '2GB', timeoutSeconds: 540 })
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

export const createDefaultUserRecords = functions
  .region(region)
  .auth.user()
  .onCreate(async (user) => {
    // ignore users created without email, since that's prob anonymous users so don't need default records
    if (!user.email) {
      return;
    }

    const store = admin.firestore();
    const firstName = user.displayName ? capitalize(words(user.displayName)[0]) : null;

    const batch = store.batch();

    const workspaceData: Workspace = {
      name: firstName ? `${firstName}'s Workspace` : 'My Workspace',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const workspaceRef = store.collection(Collections.WORKSPACES).doc();
    batch.set(workspaceRef, workspaceData);

    const userData: User = {
      displayName: user.displayName ?? user.email ?? 'Aomni Customer',
      email: user.email,
      photoURL: user.photoURL,
      defaultWorkspaceId: workspaceRef.id,
    };
    // share same uid as auth user record
    const userRef = store.collection(Collections.USERS).doc(user.uid);
    batch.set(userRef, userData);

    const memberData: Member = {
      memberId: user.uid,
      role: 'owner',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    // share the same uid as auth user record
    const memberRef = workspaceRef.collection(Collections.MEMBERS).doc(user.uid);
    batch.set(memberRef, memberData);

    await batch.commit();
  });

export const deleteWorkspaceMembers = functions
  .region(region)
  .firestore.document(`${Collections.WORKSPACES}/{workspaceId}`)
  .onWrite(async (change, context) => {
    // operate on any doc that has isDeleted marked as true
    if (!(change.after.data() as Workspace).isDeleted) {
      return;
    }

    const store = admin.firestore();

    const members = await store
      .collection(Collections.WORKSPACES)
      .doc(context.params.workspaceId)
      .collection(Collections.MEMBERS)
      .get();

    const batch = store.batch();
    members.forEach((member) =>
      batch.update(member.ref, {
        role: 'deleted',
      }),
    );
    await batch.commit();
  });
