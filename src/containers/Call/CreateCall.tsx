import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, Button, Card } from '@material-ui/core';
import LocalVideoPreview from '~/components/Video/LocalVideoPreview/LocalVideoPreview';

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

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <LocalVideoPreview />
        <Typography variant="h1">Create Call</Typography>
        <Button>Create Call</Button>
      </Card>
    </div>
  );
}
