import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Container, Typography } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    container: {},
  }),
);

export default function WaitForHost() {
  const classes = useStyles();

  return (
    <Container className={classes.container} style={{ height: '100vh', textAlign: 'center' }}>
      <Typography
        variant="h1"
        style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: '45vh' }}
      >
        Waiting for host to start the call...
      </Typography>
    </Container>
  );
}
