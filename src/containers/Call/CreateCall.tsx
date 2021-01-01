import React, { useState, useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';
import LocalPreview from './LocalPreview';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    createButton: {
      height: 50,
      borderRadius: 0,

      '& div[role=progressbar]': {
        marginRight: theme.spacing(1),
      },
    },
  }),
);

export default function CreateCall({ create }: { create(): Promise<boolean> }) {
  const classes = useStyles();
  const [isCreating, setIsCreating] = useState(false);

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
      variant="contained"
      disabled={isCreating}
    >
      {isCreating ? <CircularProgress color="inherit" size={'1rem'} /> : 'Create'}
    </Button>
  );

  return <LocalPreview actionBar={actionBar} />;
}
