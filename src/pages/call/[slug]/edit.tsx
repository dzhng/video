import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { Call } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import LoadingContainer from '~/containers/Loading/Loading';
import EditContainer from '~/containers/EditCall/EditCall';
import usePendingWrite from '~/hooks/usePendingWrite/usePendingWrite';

export default withPrivateRoute(function CallEditPage() {
  const router = useRouter();
  const [call, setCall] = useState<Call | null>(null);
  const { markIsWriting } = usePendingWrite();

  const callId = String(router.query.slug);

  useEffect(() => {
    const unsubscribe = db
      .collection('calls')
      .doc(callId)
      .onSnapshot((result) => {
        setCall(result.data() as Call);
      });

    return unsubscribe;
  }, [callId]);

  const saveCall = useCallback(
    ({ id, ...updateData }: Call) => {
      db.collection('calls').doc(id).update(updateData);
      markIsWriting();
      router.push('/');
    },
    [markIsWriting, router],
  );

  return call ? <EditContainer call={call} saveCall={saveCall} /> : <LoadingContainer />;
});
