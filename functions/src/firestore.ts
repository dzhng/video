import * as functions from 'firebase-functions';
import 'firebase-functions';
import admin from 'firebase-admin';
import fetch from 'isomorphic-unfetch';
import mailgunInit from 'mailgun-js';
import { words, capitalize } from 'lodash';
import { Collections, Presentation, User, Workspace, Member, Invite } from './schema';
import { region, registerLink, dashboardLink } from './constants';

admin.initializeApp();

const store = admin.firestore();
const mailgun = mailgunInit({
  apiKey: functions.config().mailgun.key,
  domain: functions.config().mailgun.domain,
});

async function addMemberToWorkspaceInBatch(
  batch: FirebaseFirestore.WriteBatch,
  memberId: string,
  workspaceId: string,
) {
  const memberData: Member = {
    memberId: memberId,
    role: 'owner',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const memberRef = store
    .collection(Collections.WORKSPACES)
    .doc(workspaceId)
    .collection(Collections.MEMBERS)
    .doc(memberData.memberId);

  batch.set(memberRef, memberData);
}

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
    return snap.ref.update({ slides: paths, isProcessed: true });
  });

export const createDefaultUserRecords = functions
  .region(region)
  .auth.user()
  .onCreate(async (user) => {
    // ignore users created without email, since that's prob anonymous users so don't need default records
    if (!user.email) {
      return;
    }

    const firstName = user.displayName ? capitalize(words(user.displayName)[0]) : null;

    const batch = store.batch();

    // create and add new user to their default workspace
    const workspaceData: Workspace = {
      name: firstName ? `${firstName}'s Workspace` : 'My Workspace',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const workspaceRef = store.collection(Collections.WORKSPACES).doc();
    batch.set(workspaceRef, workspaceData);
    addMemberToWorkspaceInBatch(batch, user.uid, workspaceRef.id);

    // look at existing invites and see if the user belong to any other workspaces
    const invites = await store
      .collectionGroup(Collections.INVITES)
      .where('email', '==', user.email)
      .get();
    invites.forEach((invite) => {
      // add to invited workspace and delete the invite
      addMemberToWorkspaceInBatch(batch, user.uid, invite.ref.parent.id);
      batch.delete(invite.ref);
    });

    const userData: User = {
      displayName: user.displayName ?? user.email ?? 'Aomni Customer',
      email: user.email,
      photoURL: user.photoURL,
      // for default workspace id, ideally it should be one of the invited workspace, if not fallback to default workspace
      defaultWorkspaceId: invites.size > 0 ? invites.docs[0].ref.parent.id : workspaceRef.id,
    };
    // share same uid as auth user record
    const userRef = store.collection(Collections.USERS).doc(user.uid);
    batch.set(userRef, userData);

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

export const inviteWorkspaceMember = functions
  .region(region)
  .firestore.document(`${Collections.WORKSPACES}/{workspaceId}/${Collections.INVITES}/{inviteId}`)
  .onCreate(async (snap, context) => {
    const doc = snap.data() as Invite;

    const inviterUser = await admin.auth().getUser(doc.inviterId);
    const inviterName = inviterUser.displayName;

    const workspaceRecord = await store
      .collection(Collections.WORKSPACES)
      .doc(context.params.workspaceId)
      .get();
    const workspaceName = (workspaceRecord.data() as Workspace).name;

    // first check if a user with that email already exist
    return admin
      .auth()
      .getUserByEmail(doc.email)
      .then(
        async (userRecord): Promise<void> => {
          // user does exist, add the user to the workspace member list and remove invite
          const batch = store.batch();
          addMemberToWorkspaceInBatch(batch, userRecord.uid, context.params.workspaceId);
          batch.delete(snap.ref);
          await batch.commit();

          // don't await, don't want to trigger catch block,
          // and not critically important if it fails
          const data = {
            from: 'Aomni <mailer@hello.aomni.co>',
            to: doc.email,
            subject: 'Hello',
            template: 'invite-existing-account',
            'h:X-Mailgun-Variables': JSON.stringify({
              inviterName,
              workspaceName,
              dashboardLink,
            }),
          };

          await mailgun.messages().send(data, function (error) {
            if (error) {
              console.error('Error sending email', error);
            }
          });
        },
      )
      .catch(async () => {
        // user does not exist, send out an invite email to the user
        const data = {
          from: 'Aomni <mailer@hello.aomni.co>',
          to: doc.email,
          subject: 'You have been invited to Aomni',
          template: 'invite-create-new-account',
          'h:X-Mailgun-Variables': JSON.stringify({
            inviterName,
            workspaceName,
            registerLink,
          }),
        };

        await mailgun.messages().send(data, function (error) {
          if (error) {
            console.error('Error sending email', error);
          }
        });
      });
  });
