import React, { useCallback } from 'react';
import clsx from 'clsx';
import { Button } from '@material-ui/core';
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
import { LocalModel, Template, Activity } from '~/firebase/schema-types';
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
    isDragging: {
      '& .MuiTimelineSeparator-root': {
        opacity: 0,
        transition: theme.transitionTime,
      },
    },
  }),
);

const ActivityTimelineItem = ({ activity, index }: { activity: Activity; index: number }) => (
  <Draggable draggableId={activity.id} index={index}>
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

export default function ActivitiesBar({ template }: { template: LocalModel<Template> }) {
  const classes = useStyles();

  const onDragEnd = useCallback(() => {}, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {({ innerRef, droppableProps, placeholder }, { isDraggingOver }) => (
          <div
            className={clsx({ [classes.isDragging]: isDraggingOver }, classes.container)}
            ref={innerRef}
            {...droppableProps}
          >
            <Timeline>
              {template.activities.map((activity, index) => (
                <ActivityTimelineItem key={activity.id} activity={activity} index={index} />
              ))}
              {placeholder}

              <TimelineItem>
                <TimelineOppositeContent></TimelineOppositeContent>
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
