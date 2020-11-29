import React, { useCallback } from 'react';
import { Container, Typography, Button } from '@material-ui/core';

import { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';

export default withPrivateRoute(function CreateCallPage() {
  const createCall = useCallback(() => {
    db.collection('calls').add({});
  }, []);

  return (
    <Container>
      <Typography>Create Call</Typography>
      <Button onClick={createCall}>Create</Button>
    </Container>
  );
});
