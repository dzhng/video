import React from 'react';
import { Grid, Typography, Divider, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Presentation } from '~/firebase/schema-types';
import firebase from '~/utils/firebase';
import { formatPastDate } from '~/utils';
import PresentationDisplay from '~/components/Presentation/Presentation';

interface PropTypes {
  presentation: Presentation;
  removePresentation(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(1),
    },
    imageGridItem: {
      paddingRight: theme.spacing(2),
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.grey[900],
    },
    name: {},
    info: {},
  }),
);

export default function Preview({ presentation, removePresentation }: PropTypes) {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid item xs={8} className={classes.imageGridItem}>
        <PresentationDisplay presentation={presentation} startAt={0} />
      </Grid>

      <Grid item xs={4}>
        <Typography variant="h5" className={classes.name}>
          <b>{presentation.name}</b>
        </Typography>
        <br />
        <Divider />
        <br />
        <Typography variant="body1" className={classes.info}>
          <b>Total slides:</b> {presentation.slides.length}
        </Typography>
        <Typography variant="body1" className={classes.info}>
          <b>Uploaded:</b>{' '}
          {formatPastDate((presentation.createdAt as firebase.firestore.Timestamp).toDate())}
        </Typography>
        <br />
        <Divider />
        <br />
        <Button variant="outlined" color="secondary" onClick={removePresentation}>
          Change
        </Button>
      </Grid>
    </Grid>
  );
}
