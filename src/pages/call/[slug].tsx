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
  const hasCallStarted = Boolean(call?.startTime);

  useEffect(() => {
    const fetchData = async () => {
      const result = await db.collection('calls').doc(callId).get();
      setCall(result.data() as Call);
    };

    fetchData();
  }, [callId]);

  return (
    <Container>
      <Typography>Call</Typography>
      {call}
    </Container>
  );
});
