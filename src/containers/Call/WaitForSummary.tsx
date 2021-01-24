import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Container, Typography, CircularProgress } from '@material-ui/core';

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
        marginBottom: theme.spacing(3),
        fontSize: '1.2rem',
      },
      '& div:[role=progressbar]': {
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
  }),
);

export default function WaitForSummary() {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Typography variant="h1">Generating call summary...</Typography>
      <Typography variant="body1">
        This page will automatically update when the call summary is ready.
      </Typography>
      <CircularProgress color="primary" variant="indeterminate"></CircularProgress>
    </Container>
  );
}
