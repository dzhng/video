import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

import firebase, { db } from '~/utils/firebase';
import { Call, Note } from '~/firebase/schema-types';
import { useAppState } from '~/state';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import EditContainer from '~/containers/EditCall/EditCall';

export default withPrivateRoute(function CreateCallPage() {
  const router = useRouter();
  const { user, markIsWriting } = useAppState();

  const createCall = useCallback(
    (call: Call, note: Note) => {
      if (!user) {
        // do nothing if user doesn't exist
        console.warn('Trying to create call without signed in user');
        return;
      }

      // before adding, replace timestamp with server helper
      const data = {
        ...call,
        creatorId: [user.uid],
        users: [user.uid],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      console.log('Creating with data: ', data, note);

      // batch the writes so that both notes and call is created at the same time
      const batch = db.batch();

      const callRef = db.collection('calls').doc();
      batch.set(callRef, data);

      // note shares same ID as call for easy referencing
      const noteRef = db.collection('notes').doc(callRef.id);
      batch.set(noteRef, note);

      batch.commit();
      markIsWriting();
      router.push('/');
    },
    [router, user, markIsWriting],
  );

  return <EditContainer saveCall={createCall} />;
});
