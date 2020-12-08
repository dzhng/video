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

    const admin = getAdminFirestore();

    // create a network
    const network = admin.collection('networks').doc('network');
    await network.set({ createdAt: new Date(), name: 'A Network' });

    // Create an owner user
    await admin.collection('users').doc('OwnerUser').set({
      networkId: 'network',
    });

    const profile = admin
      .collection('networks')
      .doc('network')
      .collection('admins')
      .doc('OwnerUser');
    await profile.set({
      role: 'owner',
      createdAt: new Date(),
    });

    // create a few sample user accounts first so it can be updated later
    await admin.collection('users').doc('charlie').set({
      networkId: 'network',
      createdAt: new Date(),
    });
    await admin.collection('users').doc('alice').set({
      networkId: 'network',
      createdAt: new Date(),
    });
  });

  describe('network', () => {
    it('allows anyone to read network data', async () => {
      const db = getAuthedFirestore(null);
      const network = db.collection('networks').doc('network');
      const doc = await firebase.assertSucceeds(network.get());
      expect(doc.data().name).toEqual('A Network');
    });

    it('require users to log in and be owner before updating network', async () => {
      const db = getAuthedFirestore(null);
      const network = db.collection('networks').doc('network');
      await firebase.assertFails(network.set({ name: 'hello world' }));
    });

    it('does not allow anyone to create a new network', async () => {
      const db = getAuthedFirestore({ uid: 'OwnerUser' });
      const network = db.collection('networks').doc('test');
      await firebase.assertFails(network.set({ name: 'hello world' }));
    });

    it('allows logged in owners to update network', async () => {
      const db = getAuthedFirestore({ uid: 'OwnerUser' });
      const network = db.collection('networks').doc('network');
      await firebase.assertSucceeds(network.update({ name: 'hello world' }));
    });

    it('does not allow random data to be added to network', async () => {
      const db = getAuthedFirestore({ uid: 'OwnerUser' });
      const network = db.collection('networks').doc('network');
      await firebase.assertFails(network.update({ name: 'hello world', random: 'data' }));
    });
  });

  describe('user', () => {
    it('only allow user to update their own profile', async () => {
      const db = getAuthedFirestore({ uid: 'alice' });
      const charlie = db.collection('users').doc('charlie');
      await firebase.assertFails(
        charlie.update({
          bio: 'hello world',
        }),
      );

      const alice = db.collection('users').doc('alice');
      await firebase.assertSucceeds(
        alice.update({
          bio: 'hello world',
        }),
      );
    });

    it('should enforce user profiles fields', async () => {
      const db = getAuthedFirestore({ uid: 'alice' });
      const profile = db.collection('users').doc('alice');
      await firebase.assertFails(
        profile.update({
          birthday: 'January 1',
        }),
      );
      await firebase.assertSucceeds(
        profile.update({
          bio: 'hello world',
        }),
      );
    });

    it('should not let users create profile', async () => {
      const db = getAuthedFirestore({ uid: 'alice' });
      await firebase.assertFails(
        db.collection('users').doc('bob').set({
          bio: 'hello world',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }),
      );
    });

    it('should let anyone read any profile', async () => {
      const db = getAuthedFirestore(null);
      const profile = db.collection('users').doc('alice');
      await firebase.assertSucceeds(profile.get());
    });
  });

  describe('call', () => {
    let requiredFields = {
      name: 'Test Room',
      state: 'pre',
      creatorId: 'alice',
      users: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    it('should let logged in users create a call', async () => {
      const db = getAuthedFirestore({ uid: 'alice' });
      const call = db.collection('calls').doc('call');
      await firebase.assertSucceeds(
        call.set({
          ...requiredFields,
          users: ['alice', 'charlie'],
          guestEmails: ['hello@world.com'],
        }),
      );
    });

    it('should only allow the correct state', async () => {
      const db = getAuthedFirestore({ uid: 'alice' });
      const call = db.collection('calls').doc('call');
      await firebase.assertFails(
        call.set({
          ...requiredFields,
          state: 'test',
          users: ['alice', 'charlie'],
          guestEmails: ['hello@world.com'],
        }),
      );

      // empty lists
      await firebase.assertFails(
        call.set({
          ...requiredFields,
          state: 'test',
          users: ['alice', 'charlie'],
          guestEmails: ['', 'hello@world.com'],
        }),
      );

      await firebase.assertFails(
        call.set({
          ...requiredFields,
          state: 'test',
          users: [null, 'alice', 'charlie'],
          guestEmails: ['hello@world.com'],
        }),
      );
    });

    it('should let anyone access a call', async () => {
      const db = getAuthedFirestore(null);
      const call = db.collection('calls').doc('call');
      await firebase.assertSucceeds(call.get());
    });

    it('should let anyone query for calls they belong to', async () => {
      const db = getAuthedFirestore({ uid: 'alice' });
      const calls = db.collection('calls').where('users', 'array-contains', 'alice');
      await firebase.assertSucceeds(calls.get());
    });

    it('should force the creator of the call to be a user, and have the correct creatorId', async () => {
      const db = getAuthedFirestore({ uid: 'alice' });
      const call = db.collection('calls').doc('call');
      await firebase.assertFails(
        call.set({
          ...requiredFields,
          users: ['charlie'],
        }),
      );

      await firebase.assertFails(
        call.set({
          ...requiredFields,
          users: [],
        }),
      );

      await firebase.assertFails(
        call.set({
          ...requiredFields,
          creatorId: 'bob',
          users: ['alice'],
        }),
      );
    });

    it('should only let call users update the call', async () => {
      const alice = getAuthedFirestore({ uid: 'alice' });
      let call = alice.collection('calls').doc('call');
      call.set({
        ...requiredFields,
        users: ['alice', 'charlie'],
      });

      const bob = getAuthedFirestore({ uid: 'bob' });
      call = bob.collection('calls').doc('call');
      await firebase.assertFails(
        call.update({
          name: 'Test Room 2',
        }),
      );
    });

    it('should let existing users remove themselves from the call', async () => {
      const db = getAuthedFirestore({ uid: 'alice' });
      let call = db.collection('calls').doc('call');
      call.set({
        ...requiredFields,
        users: ['alice', 'charlie'],
      });

      await firebase.assertSucceeds(
        call.update({
          users: firebase.firestore.FieldValue.arrayRemove('alice'),
        }),
      );
    });
  });

  describe('presentation', () => {
    const requiredFields = {
      name: 'hello',
      creatorId: 'alice',
      slides: [],
      isProcessed: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    it('should let logged in userse create a presentation and enforce creatorId', async () => {
      const db = getAuthedFirestore({ uid: 'alice' });
      const presentation = db.collection('presentations').doc('p');
      await firebase.assertSucceeds(presentation.set(requiredFields));

      // should be update now since record already created
      await firebase.assertSucceeds(
        presentation.update({
          name: 'hello world',
        }),
      );
    });

    it('should enforce the correct creatorId value', async () => {
      const db = getAuthedFirestore({ uid: 'alice' });
      const presentation = db.collection('presentations').doc('p');
      await firebase.assertFails(
        presentation.set({
          ...requiredFields,
          creatorId: 'bob',
        }),
      );
    });

    it('should not let other users update the presentation', async () => {
      const db = getAuthedFirestore({ uid: 'alice' });
      const presentation = db.collection('presentations').doc('p');
      await presentation.set(requiredFields);

      const bob = getAuthedFirestore({ uid: 'bob' });
      const bobPresentation = bob.collection('presentations').doc('p');
      await firebase.assertFails(
        bobPresentation.set({
          name: 'hello world',
        }),
      );
    });
  });
});
