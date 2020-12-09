import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import fetch from 'isomorphic-unfetch';

admin.initializeApp();

interface Presentation {
  slides: string[];
  isProcessed: boolean;
}

export const processPresentation = functions
  .region('europe-west1')
  .firestore.document('presentations/{presentationId}')
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
        const path = `presentations/${context.params.presentationId}/${idx}`;
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
