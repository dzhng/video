import React, { useCallback } from 'react';
import { Typography, Grid, Button, CircularProgress, Paper, InputBase } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PresentationPicker from '~/components/PresentationPicker/PresentationPicker';
import NotesEditor from '~/components/NotesEditor/NotesEditor';
import ActivityCard from './ActivityCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
    },
  }),
);

export default function ActivitiesBar() {
  const classes = useStyles();

  return (
    <Grid container spacing={1} className={classes.container}>
      <Grid item xs={12}>
        <ActivityCard />
      </Grid>
      <Grid item xs={12}>
        <ActivityCard />
      </Grid>
      <Grid item xs={12}>
        <ActivityCard />
      </Grid>
      <Grid item xs={12}>
        <ActivityCard />
      </Grid>
    </Grid>
  );
}
