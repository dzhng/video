import React, { useCallback } from 'react';
import { Typography, Grid, Button, CircularProgress, Paper, InputBase } from '@material-ui/core';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@material-ui/lab';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AddOutlined as AddIcon } from '@material-ui/icons';
import PresentationPicker from '~/components/PresentationPicker/PresentationPicker';
import NotesEditor from '~/components/NotesEditor/NotesEditor';
import ActivityCard from './ActivityCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
      borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    },
    addButton: {
      '& svg': {
        marginRight: 2,
      },
    },
  }),
);

export default function ActivitiesBar() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h3">Activities</Typography>
      <Timeline>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Eat</TimelineContent>
        </TimelineItem>
      </Timeline>

      <ActivityCard />
      <ActivityCard />
      <ActivityCard />
      <ActivityCard />

      <Button variant="contained" color="secondary" fullWidth className={classes.addButton}>
        <AddIcon /> New Activity
      </Button>
    </div>
  );
}
