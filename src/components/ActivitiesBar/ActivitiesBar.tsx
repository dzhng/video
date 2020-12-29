import React, { useCallback, useState, useMemo } from 'react';
import { debounce } from 'lodash';
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
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Collections, LocalModel, Template, Activity } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import { useAppState } from '~/state';
import PresentationPicker from '~/components/PresentationPicker/PresentationPicker';
import NotesEditor from '~/components/NotesEditor/NotesEditor';
import ActivityCard from './ActivityCard';
import NewActivityModal from './NewActivityModal';

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

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export default function ActivitiesBar({ template }: { template: LocalModel<Template> }) {
  const classes = useStyles();
  const [activities, setActivities] = useState<Activity[]>(template.activities);
  const [newActivityOpen, setNewActivityOpen] = useState(false);
  const { markIsWriting } = useAppState();

  const debouncedSaveActivities = useMemo(() => {
    const saveActivities = (newActivities: Activity[]) => {
      db.collection(Collections.TEMPLATES).doc(template.id).update({ activities: newActivities });
      markIsWriting();
    };

    return debounce(saveActivities, 200, { maxWait: 2000, trailing: true });
  }, [template, markIsWriting]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      const reorderedActivities = reorder(
        activities,
        result.source.index,
        result.destination.index,
      );
      setActivities(reorderedActivities);
      debouncedSaveActivities && debouncedSaveActivities(reorderedActivities);
    },
    [activities, debouncedSaveActivities],
  );

  const handleNewActivity = useCallback(
    (activity: Activity) => {
      const newList = [...activities, activity];
      setActivities(newList);
      debouncedSaveActivities && debouncedSaveActivities(newList);
    },
    [activities, debouncedSaveActivities],
  );

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
              {activities.map((activity, index) => (
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
                    onClick={() => setNewActivityOpen((state) => !state)}
                  >
                    <AddIcon /> New Activity
                  </Button>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>
        )}
      </Droppable>

      <NewActivityModal
        onNewActivity={handleNewActivity}
        open={newActivityOpen}
        onClose={() => setNewActivityOpen((state) => !state)}
      />
    </DragDropContext>
  );
}
