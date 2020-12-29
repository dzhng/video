import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { v1 as uuid } from 'uuid';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  InputBase,
  Typography,
  IconButton,
  Button,
} from '@material-ui/core';
import { Formik, Form } from 'formik';

import {
  BackIcon,
  PresentIcon,
  VideoIcon,
  PollIcon,
  QuestionsIcon,
  ScreenShareIcon,
  BreakoutIcon,
} from '~/components/Icons';
import { Activity, ActivityTypes } from '~/firebase/schema-types';
import CreatePresentationActivity from './CreatePresentationActivity';
import CreateVideoActivity from './CreateVideoActivity';
import CreatePollActivity from './CreatePollActivity';
import CreateQuestionsActivity from './CreateQuestionsActivity';
import CreateScreenShareActivity from './CreateScreenShareActivity';
import CreateBreakoutActivity from './CreateBreakoutActivity';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      '& .MuiDialog-paper': {
        width: '50%',
        maxWidth: theme.modalWidth,
      },
      '& .MuiDialogContent-root': {
        paddingBottom: theme.spacing(3),
      },
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    card: {
      cursor: 'pointer',
      padding: theme.spacing(2),
      display: 'flex',
      height: 150,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[5],
      transition: theme.transitionTime,

      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: theme.shadows[12],
      },

      '& h3': {
        marginBottom: theme.spacing(1),
        fontWeight: 600,
        color: 'white',
        letterSpacing: 0,
      },
    },
    icon: {
      fontSize: '2.5rem',
      color: 'white',
    },
    nameInputContainer: {
      display: 'flex',

      '& .MuiIconButton-root': {
        width: 35,
        height: 35,
      },
    },
    nameInput: {
      ...theme.typography.h2,
      flexGrow: 1,
      fontWeight: 600,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),

      // have transparent border here so its correctly sized
      border: '1px solid transparent',
      borderRadius: theme.shape.borderRadius,
      transition: theme.transitionTime,

      '&:hover': {
        border: '1px solid ' + theme.palette.grey[300],
      },

      '&.Mui-focused': {
        border: '1px solid ' + theme.palette.grey[500],
        backgroundColor: 'white',
      },
    },
    form: {
      '& .error': {
        color: theme.palette.error.main,
      },
    },
  }),
);

export default function NewActivityModal({
  onNewActivity,
  open,
  onClose,
}: {
  onNewActivity(newActivity: Activity): void;
  open: boolean;
  onClose(): void;
}) {
  const classes = useStyles();
  const [selectedType, setSelectedType] = useState<ActivityTypes | null>(null);
  const [name, setName] = useState('');

  // reset selected type every time the modal is opened so it shows picker first
  useEffect(() => {
    if (open) {
      setSelectedType(null);
    }
  }, [open]);

  const handleSubmit = useCallback(
    (metadata) => {
      console.log('SUBMIT', metadata);
      if (!selectedType) {
        return;
      }

      // generate random id for activity
      const id = uuid();

      const activity: Activity = {
        id,
        name: name ?? 'New Activity',
        type: selectedType,
        metadata,
      };

      onNewActivity(activity);
      onClose();
    },
    [onNewActivity, onClose, name, selectedType],
  );

  const activityTypes: {
    type: ActivityTypes;
    name: string;
    icon: JSX.Element;
    form: JSX.Element;
    initialValue: object;
    schema: Yup.ObjectSchema;
  }[] = useMemo(
    () => [
      {
        type: 'presentation',
        name: 'Presentation',
        icon: <PresentIcon className={classes.icon} />,
        form: <CreatePresentationActivity />,
        initialValue: { presentationId: null },
        schema: Yup.object().shape({
          presentationId: Yup.string().nullable().max(30).required('Presentation not uploaded'),
        }),
      },
      {
        type: 'video',
        name: 'Video',
        icon: <VideoIcon className={classes.icon} />,
        form: <CreateVideoActivity />,
        initialValue: { videoId: null },
        schema: Yup.object().shape({
          videoId: Yup.string().nullable().max(30).required('Video not uploaded'),
        }),
      },
      {
        type: 'poll',
        name: 'Poll',
        icon: <PollIcon className={classes.icon} />,
        form: <CreatePollActivity />,
        initialValue: {},
        schema: Yup.object().shape({}),
      },
      {
        type: 'questions',
        name: 'Questions',
        icon: <QuestionsIcon className={classes.icon} />,
        form: <CreateQuestionsActivity />,
        initialValue: {},
        schema: Yup.object().shape({}),
      },
      {
        type: 'screenshare',
        name: 'Screenshare',
        icon: <ScreenShareIcon className={classes.icon} />,
        form: <CreateScreenShareActivity />,
        initialValue: { hostOnly: false },
        schema: Yup.object().shape({
          hostOnly: Yup.boolean().required(),
        }),
      },
      {
        type: 'breakout',
        name: 'Breakout',
        icon: <BreakoutIcon className={classes.icon} />,
        form: <CreateBreakoutActivity />,
        initialValue: {},
        schema: Yup.object().shape({}),
      },
    ],
    [classes],
  );

  const handleSelectType = useCallback(
    (type) => {
      const selectedActivity = activityTypes.find((activity) => activity.type === type);

      if (selectedActivity) {
        setSelectedType(type);

        // set default name
        setName(selectedActivity.name + ' Activity');
      }
    },
    [activityTypes],
  );

  const selectedActivity = activityTypes.find((activity) => activity.type === selectedType);

  return (
    <Dialog className={classes.modal} open={open} onClose={onClose}>
      <DialogTitle disableTypography>
        {selectedType ? (
          <div className={classes.nameInputContainer}>
            <IconButton
              className={classes.backButton}
              size="small"
              onClick={() => setSelectedType(null)}
            >
              <BackIcon />
            </IconButton>

            <InputBase
              className={classes.nameInput}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          </div>
        ) : (
          <Typography variant="h2">
            <b>New Activity</b>
          </Typography>
        )}
      </DialogTitle>

      {selectedActivity ? (
        <Formik
          initialValues={selectedActivity.initialValue}
          validationSchema={selectedActivity.schema}
          onSubmit={handleSubmit}
        >
          <Form className={classes.form}>
            <DialogContent dividers>{selectedActivity.form}</DialogContent>

            <DialogActions>
              <Button type="submit" color="primary" variant="contained">
                Create
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      ) : (
        <DialogContent dividers>
          <Grid container spacing={3}>
            {activityTypes.map((activity) => (
              <Grid item xs={12} md={6} lg={4} key={activity.type}>
                <Card className={classes.card} onClick={() => handleSelectType(activity.type)}>
                  <Typography variant="h3">{activity.name}</Typography>
                  {activity.icon}
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      )}
    </Dialog>
  );
}
