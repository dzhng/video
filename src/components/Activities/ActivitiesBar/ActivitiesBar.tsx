import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { debounce } from 'lodash';
import clsx from 'clsx';
import { Typography, Button, CardContent } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AddOutlined as AddIcon } from '@material-ui/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Collections, LocalModel, Template, Activity } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import { useAppState } from '~/state';
import NewActivityModal from './NewActivityModal';
import EditActivityModal from './EditActivityModal';
import ConfirmStartModal from './ConfirmStartModal';
import ActivityCard from './ActivityCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      overflowY: 'auto',

      // scroll bar customization
      '&::-webkit-scrollbar': {
        width: 10,
      },
      '&::-webkit-scrollbar-track': {
        background: 'none',
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: 5,
        background: 'rgba(0,0,0,0.2)',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(0,0,0,0.4)',
      },

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
    timelineItem: {
      margin: theme.spacing(2),
    },
    addButton: {
      height: 60,

      '& svg': {
        marginRight: 2,
      },
    },
    isDragging: {
      // NOTE: put item dragging css here
    },
  }),
);

const ActivityTimelineItem = ({
  activity,
  index,
  mode,
  ...otherProps
}: {
  activity: Activity;
  mode: 'edit' | 'call' | 'view';
  index: number;
  save(activity: Activity): void;
  onEdit(): void;

  isStarted?: boolean;
  onStart?(): void;
}) => {
  const classes = useStyles();
  return (
    <Draggable draggableId={activity.id} isDragDisabled={mode === 'view'} index={index}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <div
          className={classes.timelineItem}
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
        >
          <ActivityCard activity={activity} mode={mode} {...otherProps} />
        </div>
      )}
    </Draggable>
  );
};

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

interface PropTypes {
  template: LocalModel<Template>;

  // edit mode shows editing controls, call mode shows playback controls
  mode: 'edit' | 'call' | 'view';

  // only valid in call mode
  currentActivity?: Activity;
  startActivity?(activity: Activity): void;
}

export default function ActivitiesBar({
  template,
  mode,
  startActivity,
  currentActivity,
}: PropTypes) {
  const classes = useStyles();
  // have a local copy of activities here so that we can debounce saving to firebase (we can edit and see results without depending on template.activities to update in real-time)
  const [activities, setActivities] = useState<Activity[]>(template.activities);
  const [newActivityOpen, setNewActivityOpen] = useState(false);
  const [editActivityIndex, setEditActivityIndex] = useState<number | null>(null);
  const [confirmStartActivity, setConfirmStartActivity] = useState<Activity | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { markIsWriting } = useAppState();

  // whenever the template changes, update activities array
  useEffect(() => {
    setActivities(template.activities);
  }, [template]);

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

  const handleDeleteActivity = useCallback(
    (index: number) => {
      const newList = [...activities];
      newList.splice(index, 1);
      setActivities(newList);
      debouncedSaveActivities && debouncedSaveActivities(newList);
    },
    [activities, debouncedSaveActivities],
  );

  // start activity right away if none is started, if not, ask for confirmation first
  const handleStartActivity = useCallback(
    (activity: Activity) => {
      if (currentActivity) {
        setConfirmStartActivity(activity);
      } else {
        startActivity?.(activity);
      }
    },
    [currentActivity, startActivity],
  );

  const handleCancelStartActivity = useCallback(() => {
    setConfirmStartActivity(null);
  }, []);

  const handleStartActivityConfirm = useCallback(() => {
    if (confirmStartActivity) {
      startActivity?.(confirmStartActivity);
    }
  }, [startActivity, confirmStartActivity]);

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
            {activities.length <= 2 && mode === 'edit' && (
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

            {activities.map((activity, index) => (
              <ActivityTimelineItem
                key={activity.id}
                activity={activity}
                mode={mode}
                index={index}
                save={(values: Activity) => handleSaveActivity(values, index)}
                onEdit={() => setEditActivityIndex(index)}
                isStarted={currentActivity === activity}
                onStart={() => handleStartActivity(activity)}
              />
            ))}

            {placeholder}

            {mode !== 'view' && (
              <div className={classes.timelineItem}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={classes.addButton}
                  onClick={() => setNewActivityOpen((state) => !state)}
                >
                  <AddIcon /> New Activity
                </Button>
              </div>
            )}
          </div>
        )}
      </Droppable>

      <NewActivityModal
        onNewActivity={handleNewActivity}
        open={newActivityOpen}
        onClose={() => setNewActivityOpen((state) => !state)}
      />

      {editActivityIndex !== null && (
        <EditActivityModal
          activity={template.activities[editActivityIndex]}
          save={(values) => handleSaveActivity(values, editActivityIndex)}
          open={true}
          onClose={() => setEditActivityIndex(null)}
          onDelete={() => handleDeleteActivity(editActivityIndex)}
        />
      )}

      {confirmStartActivity !== null && (
        <ConfirmStartModal
          open={!!confirmStartActivity}
          onClose={handleCancelStartActivity}
          onConfirm={handleStartActivityConfirm}
        />
      )}
    </DragDropContext>
  );
}
