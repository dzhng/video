import React, { useState, useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';
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
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: theme.modalWidth,
    },
    createButton: {
      '& div[role=progressbar]': {
        marginRight: theme.spacing(1),
      },
    },
  }),
);

export default function CreateCall({ create }: { create(): Promise<boolean> }) {
  const classes = useStyles();
  const [isCreating, setIsCreating] = useState(true);

  const handleCreate = useCallback(() => {
    if (isCreating) {
      return;
    }

    create();
    setIsCreating(true);
  }, [create, isCreating]);

  const actionBar = (
    <Button
      color="primary"
      onClick={handleCreate}
      className={classes.createButton}
      disabled={isCreating}
    >
      {isCreating && <CircularProgress color="inherit" size={'1rem'} />} Create
    </Button>
  );

  return (
    <div className={classes.container}>
      <LocalPreviewCard className={classes.card} actionBar={actionBar} />
    </div>
  );
}
