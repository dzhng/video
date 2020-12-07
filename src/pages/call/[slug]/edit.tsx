import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { LocalModel, Call, Note } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import { useAppState } from '~/state';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import LoadingContainer from '~/containers/Loading/Loading';
import EditContainer from '~/containers/EditCall/EditCall';

export default withPrivateRoute(function CallEditPage() {
  const router = useRouter();
  const [call, setCall] = useState<LocalModel<Call> | undefined>(undefined);
  const [note, setNote] = useState<LocalModel<Note> | undefined>(undefined);
  const { markIsWriting } = useAppState();

  const callId = String(router.query.slug);

  useEffect(() => {
    const unsubscribe = db
      .collection('calls')
      .doc(callId)
      .onSnapshot((result) => {
        setCall({
          id: callId,
          ...(result.data() as Call),
        });
      });

    return unsubscribe;
  }, [callId]);

  useEffect(() => {
    const unsubscribe = db
      .collection('notes')
      .doc(callId)
      .onSnapshot((result) => {
        setNote({
          id: callId,
          ...(result.data() as Note),
        });
      });

    return unsubscribe;
  }, [callId]);

  const saveCall = useCallback(
    (callData: Call, noteData: Note) => {
      const batch = db.batch();
      const callRef = db.collection('calls').doc(callId);
      const noteRef = db.collection('notes').doc(callId);

      batch.update(callRef, callData);
      batch.update(noteRef, noteData);

      batch.commit();
      markIsWriting();
      router.push('/');
    },
    [callId, markIsWriting, router],
  );

  return call && note ? (
    <EditContainer call={call} note={note} saveCall={saveCall} />
  ) : (
    <LoadingContainer />
  );
});
