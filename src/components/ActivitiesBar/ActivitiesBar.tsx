import React, { useCallback, useState, useMemo } from 'react';
import { debounce } from 'lodash';
import clsx from 'clsx';
import { Typography, Button, Card, CardContent } from '@material-ui/core';
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
import NewActivityModal from './NewActivityModal/NewActivityModal';
import ActivityCard from './ActivityCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      '& .MuiTimelineOppositeContent-root': {
        flex: 0,
        paddingLeft: 0,
        paddingRight: 0,
      },

      '& h2': {
        marginBottom: theme.spacing(1),
      },
    },
    hintCard: {
      // add some transparency
      backgroundColor: theme.palette.info.light + '40',
      borderBottom: theme.dividerBorder,
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

const ActivityTimelineItem = ({
  activity,
  index,
  save,
}: {
  activity: Activity;
  index: number;
  save(activity: Activity): void;
}) => (
  <Draggable draggableId={activity.id} index={index}>
    {({ innerRef, draggableProps, dragHandleProps }) => (
      <TimelineItem ref={innerRef} {...draggableProps} {...dragHandleProps}>
        <TimelineOppositeContent></TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <ActivityCard activity={activity} save={save} />
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
  const [isDragging, setIsDragging] = useState(false);
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
      setIsDragging(false);

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

  const handleSaveActivity = useCallback(
    (activity: Activity, index: number) => {
      const newList = [...activities];
      newList[index] = activity;
      setActivities(newList);
      debouncedSaveActivities && debouncedSaveActivities(newList);
    },
    [activities, debouncedSaveActivities],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={() => setIsDragging(true)}>
      <Droppable droppableId="list">
        {({ innerRef, droppableProps, placeholder }) => (
          <div
            className={clsx({ [classes.isDragging]: isDragging }, classes.container)}
            ref={innerRef}
            {...droppableProps}
          >
            {/* Hide hint card after more than 2 activities since the user probably know what it is at that point. It also takes up a lot of space. */}
            {activities.length <= 2 && (
              <div className={classes.hintCard}>
                <CardContent>
                  <Typography variant="h2">
                    <b>Structure your call with activities</b>
                  </Typography>
                  <Typography variant="body1">
                    Activities are different interactions that engage the audience. Some activities
                    are driven purely by the host, some engage everyone in the call.
                  </Typography>
                </CardContent>
              </div>
            )}

            <Timeline>
              {activities.map((activity, index) => (
                <ActivityTimelineItem
                  key={activity.id}
                  activity={activity}
                  index={index}
                  save={(values) => handleSaveActivity(values, index)}
                />
              ))}

              {placeholder}

              <TimelineItem>
                {/* Timeline items has a weird idiosyncracy here where if TimelineOppositeContent is not defined, it will add a 50% pad (because the timeline wants to be centered by default. Since we want our timeline to be on the left, we define an empty OppositeContent and get rid of the 50% pad via css */}
                <TimelineOppositeContent></TimelineOppositeContent>

                {/* It only makes sense to show timeline on create button when there's at least one activity, or else it'll just be a weird icon there by itself */}
                {activities.length > 0 && (
                  <TimelineSeparator>
                    <TimelineDot />
                  </TimelineSeparator>
                )}

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
