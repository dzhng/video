import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(3),
    },
  }),
);

export default function PresentationPicker() {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6">Presentation</Typography>
    </Paper>
  );
}
