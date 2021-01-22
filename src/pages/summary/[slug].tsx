import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Collections, LocalModel, Call, CallData } from '~/firebase/schema-types';
import { db, rtdb } from '~/utils/firebase';
import LoadingContainer from '~/containers/Loading/Loading';
import SummaryContainer from '~/containers/Summary/Summary';

interface RootCallData {
  [key: string]: CallData;
}

// view call summary from call id
export default function SummaryPage() {
  const router = useRouter();
  const [call, setCall] = useState<LocalModel<Call>>();
  const [callData, setCallData] = useState<RootCallData>();

  const callId = String(router.query.slug);

  // fetch call model
  useEffect(() => {
    if (!callId) {
      return;
    }

    const unsubscribe = db
      .collection(Collections.CALLS)
      .doc(callId)
      .onSnapshot((result) => {
        setCall({
          id: result.id,
          ...(result.data() as Call),
        });
      });

    return unsubscribe;
  }, [callId]);

  // fetch call data
  useEffect(() => {
    if (!callId) {
      return;
    }

    const valueRef = rtdb.ref(`calls/${callId}`);
    valueRef.on('value', (snapshot) => {
      setCallData(snapshot.val() ?? {});
    });
  }, [callId]);

  if (!call || !callData) {
    return <LoadingContainer />;
  }

  return <SummaryContainer call={call} data={callData} />;
}
