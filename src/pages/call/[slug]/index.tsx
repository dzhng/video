import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';

import { Call } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';

export default withPrivateRoute(function CallPage() {
  const router = useRouter();
  const [call, setCall] = useState<Call | undefined>(undefined);

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

  // route to other locations if
  useEffect(() => {
    if (!call?.hasFinished) {
      router.push('post');
    } else if (!call?.hasStarted) {
      router.push('pre');
    }
  }, [router, call]);

  return (
    <Container>
      <Typography>Call</Typography>
      {call}
    </Container>
  );
});
