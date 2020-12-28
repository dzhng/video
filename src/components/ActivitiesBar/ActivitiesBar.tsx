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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

const ActivityTimelineItem = ({ id, index }: { id: string; index: number }) => (
  <Draggable draggableId={id} index={index}>
    {({ innerRef, draggableProps, dragHandleProps }) => (
      <TimelineItem ref={innerRef} {...draggableProps} {...dragHandleProps}>
        <TimelineOppositeContent></TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <ActivityCard />
        </TimelineContent>
      </TimelineItem>
    )}
  </Draggable>
);

export default function ActivitiesBar() {
  const classes = useStyles();

  const onDragEnd = useCallback(() => {}, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {({ innerRef, droppableProps, placeholder }) => (
          <div className={classes.container} ref={innerRef} {...droppableProps}>
            <Timeline>
              <ActivityTimelineItem id="1" index={1} />
              <ActivityTimelineItem id="2" index={2} />
              <ActivityTimelineItem id="3" index={3} />
              <ActivityTimelineItem id="4" index={4} />
              {placeholder}

              <TimelineItem>
                <TimelineOppositeContent></TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    className={classes.addButton}
                  >
                    <AddIcon /> New Activity
                  </Button>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
