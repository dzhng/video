import React, { useCallback } from 'react';
import { Typography, Grid, Button, CircularProgress, Paper, InputBase } from '@material-ui/core';
import PresentationPicker from '~/components/PresentationPicker/PresentationPicker';
import NotesEditor from '~/components/NotesEditor/NotesEditor';
import ActivitiesCard from './ActivitiesCard';

export default function ActivitiesBar() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <ActivitiesCard />
      </Grid>
      <Grid item xs={12}>
        <ActivitiesCard />
      </Grid>
      <Grid item xs={12}>
        <ActivitiesCard />
      </Grid>
      <Grid item xs={12}>
        <ActivitiesCard />
      </Grid>
    </Grid>
  );
}
