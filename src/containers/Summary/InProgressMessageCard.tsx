import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, LinearProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      '& h2': {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        fontWeight: 'bold',
      },
      '& p': {
        color: theme.palette.grey[800],
      },
      '& div[role=progressbar]': {
        height: 10,
        borderRadius: 5,
      },
    },
  }),
);

export default function InProgressMessageCard() {
  const classes = useStyles();

  return (
    <Card className={classes.container}>
      <CardContent>
        <Typography variant="h2">Call in progress...</Typography>
        <Typography variant="body1">
          This call has not finished yet. This page will automatically refresh with call notes when
          the call this call is over.
        </Typography>
        <br />
        <Typography variant="body1">
          The data from this call will be permenantly stored on this page. Check back any time to
          see notes and call details.
        </Typography>
        <br />
        <LinearProgress />
      </CardContent>
    </Card>
  );
}
