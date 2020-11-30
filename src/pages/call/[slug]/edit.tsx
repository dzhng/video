import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Call } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import LoadingContainer from '~/containers/Loading/Loading';
import EditContainer from '~/containers/Call/Edit';

export default withPrivateRoute(function CallEditPage() {
  const router = useRouter();
  const [call, setCall] = useState<Call | null>(null);

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

  return call ? <EditContainer call={call} /> : <LoadingContainer />;
});