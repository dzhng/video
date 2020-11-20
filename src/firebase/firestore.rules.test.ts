/**
 * @jest-environment node
 */

import * as firebase from '@firebase/rules-unit-testing';
import path from 'path';
import fs from 'fs';

console.log(`EMULATOR HOST: ${process.env.FIRESTORE_EMULATOR_HOST}`);

/**
 * The emulator will accept any project ID for testing.
 */
const PROJECT_ID = 'firestore-emulator-test';

/**
 * Creates a new client FirebaseApp with authentication and returns the Firestore instance.
 */
function getAuthedFirestore(auth: { uid: string } | null) {
  return firebase.initializeTestApp({ projectId: PROJECT_ID, auth: auth ?? undefined }).firestore();
}

function getAdminFirestore() {
  return firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore();
}

describe('firebase cloud firestore database rules', () => {
  beforeAll(async () => {
    // Load the rules file before the tests begin
    const rules = fs.readFileSync(path.resolve(__dirname, './firestore.rules'), 'utf8');
    await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
  });

  afterAll(async () => {
    // Delete all the FirebaseApp instances created during testing
    // Note: this does not affect or clear any data
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  beforeEach(async () => {
    // Clear the database between tests
    await firebase.clearFirestoreData({ projectId: PROJECT_ID });

    // Create an owner user
    const admin = getAdminFirestore();
    const adminProfile = admin.collection('admins').doc('OwnerUser');
    await firebase.assertSucceeds(adminProfile.set({ role: 'owner' }));
  });

  it('allows anyone to read network data', async () => {
    const db = getAuthedFirestore(null);
    const network = db.collection('networks').doc('apple');
    await firebase.assertSucceeds(network.get());
  });

  it('require users to log in and be owner before updating network', async () => {
    const db = getAuthedFirestore(null);
    const profile = db.collection('networks').doc('apple');
    await firebase.assertFails(profile.set({ name: 'hello world' }));
  });

  it('allows logged in owners to update network', async () => {
    const db = getAuthedFirestore({ uid: 'OwnerUser' });
    const profile = db.collection('networks').doc('apple');
    await firebase.assertSucceeds(profile.set({ name: 'hello world' }));
  });

  /*it('should enforce the createdAt date in user profiles', async () => {
    const db = getAuthedFirestore({ uid: 'alice' });
    const profile = db.collection('users').doc('alice');
    await firebase.assertFails(profile.set({ birthday: 'January 1' }));
    await firebase.assertSucceeds(
      profile.set({
        birthday: 'January 1',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    );
  });

  it('should only let users create their own profile', async () => {
    const db = getAuthedFirestore({ uid: 'alice' });
    await firebase.assertSucceeds(
      db.collection('users').doc('alice').set({
        birthday: 'January 1',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    );
    await firebase.assertFails(
      db.collection('users').doc('bob').set({
        birthday: 'January 1',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    );
  });

  it('should let anyone read any profile', async () => {
    const db = getAuthedFirestore(null);
    const profile = db.collection('users').doc('alice');
    await firebase.assertSucceeds(profile.get());
  });

  it('should let anyone create a room', async () => {
    const db = getAuthedFirestore({ uid: 'alice' });
    const room = db.collection('rooms').doc('firebase');
    await firebase.assertSucceeds(
      room.set({
        owner: 'alice',
        topic: 'All Things Firebase',
      }),
    );
  });

  it('should force people to name themselves as room owner when creating a room', async () => {
    const db = getAuthedFirestore({ uid: 'alice' });
    const room = db.collection('rooms').doc('firebase');
    await firebase.assertFails(
      room.set({
        owner: 'scott',
        topic: 'Firebase Rocks!',
      }),
    );
  });

  it('should not let one user steal a room from another user', async () => {
    const alice = getAuthedFirestore({ uid: 'alice' });
    const bob = getAuthedFirestore({ uid: 'bob' });

    await firebase.assertSucceeds(
      bob.collection('rooms').doc('snow').set({
        owner: 'bob',
        topic: 'All Things Snowboarding',
      }),
    );

    await firebase.assertFails(
      alice.collection('rooms').doc('snow').set({
        owner: 'alice',
        topic: 'skiing > snowboarding',
      }),
    );
  });*/
});
