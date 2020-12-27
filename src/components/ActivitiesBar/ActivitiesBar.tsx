import React, { useCallback } from 'react';
import { Typography, Grid, Button, CircularProgress, Paper, InputBase } from '@material-ui/core';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
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
      '& .MuiTimelineOppositeContent-root': {
        flex: 0,
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    addButton: {
      '& svg': {
        marginRight: 2,
      },
    },
  }),
);

const ActivityTimelineItem = () => (
  <TimelineItem>
    <TimelineOppositeContent></TimelineOppositeContent>
    <TimelineSeparator>
      <TimelineDot />
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>
      <ActivityCard />
    </TimelineContent>
  </TimelineItem>
);

export default function ActivitiesBar() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Timeline>
        <ActivityTimelineItem />
        <ActivityTimelineItem />
        <ActivityTimelineItem />
        <ActivityTimelineItem />

        <TimelineItem>
          <TimelineOppositeContent></TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>
            <Button variant="contained" color="secondary" fullWidth className={classes.addButton}>
              <AddIcon /> New Activity
            </Button>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
}
