import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import path from 'path';

admin.initializeApp();

export const helloWorld = functions.region('europe-west1').https.onRequest((_, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

export const processFile = functions
  .region('europe-west1')
  .storage.object()
  .onFinalize(async (object) => {
    if (!object.name) {
      functions.logger.warn('Unnamed file uploaded, deleting...', { structuredData: true });
      return;
    }

    const parsed = path.parse(object.name);

    // if it's a new presentation, start processing
    if (parsed.dir === '/presentations/temp') {
    }

    return;
  });
