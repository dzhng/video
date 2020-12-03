import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

import firebase, { db } from '~/utils/firebase';
import { Call } from '~/firebase/schema-types';
import { useAppState } from '~/state';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import EditContainer from '~/containers/EditCall/EditCall';

export default withPrivateRoute(function CreateCallPage() {
  const router = useRouter();
  const { user, markIsWriting } = useAppState();

  const createCall = useCallback(
    (call: Call) => {
      if (!user) {
        // do nothing if user doesn't exist
        console.warn('Trying to create call without signed in user');
        return;
      }

      // before adding, replace timestamp with server helper
      const data = {
        ...call,
        users: [user.uid],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      console.log(data);
      //db.collection('calls').add(data);
      markIsWriting();
      router.push('/');
    },
    [router, user, markIsWriting],
  );

  return <EditContainer saveCall={createCall} />;
});
