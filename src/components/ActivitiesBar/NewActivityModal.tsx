import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

import { BackIcon } from '~/components/Icons';
import { Activity, ActivityTypes } from '~/firebase/schema-types';

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

      '& .TypeIcon': {
        fontSize: '2.5rem',
        color: 'white',
      },
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
        marginTop: theme.spacing(1),
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
        {selectedActivity ? (
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
              onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                e.target.setSelectionRange(0, 100)
              }
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
