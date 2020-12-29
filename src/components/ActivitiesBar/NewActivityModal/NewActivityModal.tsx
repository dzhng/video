import React, { useState, useEffect, useCallback } from 'react';
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

  // reset selected type every time the modal is opened so it shows picker first
  useEffect(() => {
    if (open) {
      setSelectedType(null);
    }
  }, [open]);

  const handleSubmit = useCallback(
    (metadata) => {
      if (!selectedType) {
        return;
      }

      // generate random id for activity
      const id = uuid();

      const activity: Activity = {
        id,
        type: selectedType!,
        metadata,
      };

      onNewActivity(activity);
    },
    [onNewActivity, selectedType],
  );

  const activityTypes: {
    type: ActivityTypes;
    name: string;
    icon: JSX.Element;
    form: JSX.Element;
    schema: Yup.ObjectSchema;
  }[] = [
    {
      type: 'presentation',
      name: 'Presentation',
      icon: <PresentIcon className={classes.icon} />,
      form: <CreatePresentationActivity />,
      schema: Yup.object().shape({
        presentationId: Yup.string().max(30).required(),
      }),
    },
    {
      type: 'video',
      name: 'Video',
      icon: <VideoIcon className={classes.icon} />,
      form: <CreateVideoActivity />,
      schema: Yup.object().shape({
        videoId: Yup.string().max(30).required(),
      }),
    },
    {
      type: 'poll',
      name: 'Poll',
      icon: <PollIcon className={classes.icon} />,
      form: <CreatePollActivity />,
      schema: Yup.object().shape({}),
    },
    {
      type: 'questions',
      name: 'Questions',
      icon: <QuestionsIcon className={classes.icon} />,
      form: <CreateQuestionsActivity />,
      schema: Yup.object().shape({}),
    },
    {
      type: 'screenshare',
      name: 'Screenshare',
      icon: <ScreenShareIcon className={classes.icon} />,
      form: <CreateScreenShareActivity />,
      schema: Yup.object().shape({
        hostOnly: Yup.boolean().required(),
      }),
    },
    {
      type: 'breakout',
      name: 'Breakout',
      icon: <BreakoutIcon className={classes.icon} />,
      form: <CreateBreakoutActivity />,
      schema: Yup.object().shape({}),
    },
  ];

  const selectedActivity = activityTypes.find((activity) => activity.type === selectedType);

  return (
    <Dialog className={classes.modal} open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h2">
          {selectedType && (
            <IconButton
              className={classes.backButton}
              size="small"
              onClick={() => setSelectedType(null)}
            >
              <BackIcon />
            </IconButton>
          )}

          <b>New {selectedActivity ? selectedActivity.name + ' ' : ''}Activity</b>
        </Typography>
      </DialogTitle>

      {selectedActivity ? (
        <Formik
          initialValues={{}}
          validationSchema={selectedActivity.schema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <DialogContent dividers>{selectedActivity.form}</DialogContent>

              <DialogActions>
                <Button type="submit" color="primary" variant="contained" autoFocus>
                  Create
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      ) : (
        <DialogContent dividers>
          <Grid container spacing={3}>
            {activityTypes.map((activity) => (
              <Grid item xs={12} md={6} lg={4}>
                <Card className={classes.card} onClick={() => setSelectedType(activity.type)}>
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
