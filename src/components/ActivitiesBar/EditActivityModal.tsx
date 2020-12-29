import React, { useState, useCallback, useMemo } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputBase,
  Tooltip,
  Button,
  IconButton,
} from '@material-ui/core';
import { DeleteOutlined as DeleteIcon } from '@material-ui/icons';
import { Formik, Form } from 'formik';

import { Activity } from '~/firebase/schema-types';
import { ActivityTypeForms } from './Types/Types';

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
    actions: {
      justifyContent: 'space-between',
    },
  }),
);

export default function EditActivityModal({
  activity,
  save,
  open,
  onClose,
  onDelete,
}: {
  activity: Activity;
  save(values: Activity): void;
  open: boolean;
  onClose(): void;
  onDelete(): void;
}) {
  const classes = useStyles();
  const [name, setName] = useState(activity.name);
  const selectedActivity = useMemo(() => ActivityTypeForms.find((a) => a.type === activity.type), [
    activity,
  ]);

  const handleSubmit = useCallback(
    (metadata) => {
      const newActivity: Activity = {
        ...activity,
        name,
        metadata,
      };

      save(newActivity);
      onClose();
    },
    [activity, name, onClose, save],
  );

  return (
    <Dialog className={classes.modal} open={open} onClose={onClose}>
      <DialogTitle disableTypography>
        <div className={classes.nameInputContainer}>
          <InputBase
            className={classes.nameInput}
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
        </div>
      </DialogTitle>

      <Formik
        initialValues={activity.metadata}
        validationSchema={selectedActivity?.schema}
        onSubmit={handleSubmit}
      >
        <Form className={classes.form}>
          <DialogContent dividers>{selectedActivity?.form}</DialogContent>

          <DialogActions className={classes.actions}>
            <Tooltip title="Delete activity" placement="right">
              <IconButton size="small" onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>

            <Button type="submit" color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
}
