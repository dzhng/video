import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, Card } from '@material-ui/core';
import LocalPreviewCard from './LocalPreviewCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: theme.palette.grey[900],
      height: '100%',
    },
    card: {
      width: '50%',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: theme.modalWidth,
    },
  }),
);

export default function CreateCall({ create }: { create(): Promise<boolean> }) {
  const classes = useStyles();

  const actionBar = <Button>Create</Button>;

  return (
    <div className={classes.container}>
      <LocalPreviewCard className={classes.card} actionBar={actionBar} />
    </div>
  );
}
