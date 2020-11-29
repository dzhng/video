import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import Link from 'next/link';

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

  return (
    <Container>
      <Link href="edit">
        <Button>Edit Call</Button>
      </Link>
      <Typography>Call</Typography>
      {call}
    </Container>
  );
});
