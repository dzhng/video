import React from 'react';
import { Container, CircularProgress } from '@material-ui/core';

export default function LoadingContainer() {
  return (
    <Container style={{ textAlign: 'center' }}>
      <CircularProgress
        color="primary"
        variant="indeterminate"
        style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}
      ></CircularProgress>
    </Container>
  );
}
