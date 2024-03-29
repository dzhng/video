import React from 'react';
import Link from 'next/link';
import { Typography, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: '20vh',
      textAlign: 'center',

      '& h1': {
        fontSize: '3rem',
        marginBottom: theme.spacing(1),
      },

      '& button': {
        margin: theme.spacing(2),
      },
    },
  }),
);

interface PropTypes {
  // did the user explicitly leave? Or was call ended by host?
  hostEnded: boolean;

  // explicitly state where the home button should link
  fromHref?: string;
}

export default function FinishCall({ hostEnded, fromHref }: PropTypes) {
  const classes = useStyles();
  const message = hostEnded ? 'The call has been ended by the host' : 'You have left the call';

  return (
    <div className={classes.container}>
      <Typography variant="h1">Thank you!</Typography>
      <Typography variant="body1">{message}</Typography>

      <Link href={fromHref ? fromHref : '/'}>
        <Button variant="contained" color="primary" size="large">
          Finish
        </Button>
      </Link>
    </div>
  );
}
