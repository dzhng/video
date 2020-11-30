import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

import firebase, { db } from '~/utils/firebase';
import { Call } from '~/firebase/schema-types';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import CreateContainer from '~/containers/Call/Create';
import usePendingWrite from '~/hooks/usePendingWrite/usePendingWrite';

export default withPrivateRoute(function CreateCallPage() {
  const router = useRouter();
  const { markIsWriting } = usePendingWrite();

  const createCall = useCallback(
    (call: Call) => {
      // before adding, replace timestamp with server helper
      const data = {
        ...call,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      db.collection('calls').add(data);
      markIsWriting();
      router.push('/');
    },
    [router, markIsWriting],
  );

  return <CreateContainer createCall={createCall} />;
});
