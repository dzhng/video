import React from 'react';
import { Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '20vh',
    },
  }),
);

interface PropTypes {
  // did the user explicitly leave? Or was call ended by host?
  didLeave: boolean;
}

export default function FinishCall({ didLeave }: PropTypes) {
  const classes = useStyles();
  const message = didLeave ? 'You have left the call' : 'The call has been ended by the host';

  return (
    <div className={classes.container}>
      <Typography variant="h1">Thank you!</Typography>
      <Typography variant="body1">{message}</Typography>
    </div>
  );
}
