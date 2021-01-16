import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Container, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',

      '& h1': {
        fontSize: '3rem',
      },
      '& p': {
        marginTop: theme.spacing(2),
        fontSize: '1.2rem',
      },
    },
  }),
);

export default function WaitForHost() {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Typography variant="h1">Waiting for host to start the call...</Typography>
      <Typography variant="body1">
        This page will automatically update when the call starts.
      </Typography>
    </Container>
  );
}
