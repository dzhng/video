import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { Card, Typography, Button, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { EditOutlined as EditIcon, PlayArrow as StartIcon } from '@material-ui/icons';
import { Activity } from '~/firebase/schema-types';
import EditableTitle from '~/components/EditableTitle/EditableTitle';

const NameSchema = Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(1),

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
        boxShadow: theme.shadows[4],
      },
    },
    activityType: {
      color: theme.palette.grey[600],
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    content: {
      flexGrow: 1,
      paddingTop: 2,
    },
    buttonContainer: {
      display: 'flex',
      marginTop: 'auto',
      marginBottom: 'auto',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),

      '& button': {
        width: 36,
        height: 36,
        minWidth: 0,
        padding: 0,
        borderRadius: 18,
        marginLeft: theme.spacing(1),
      },
    },
  }),
);

interface PropTypes {
  activity: Activity;
  mode: 'edit' | 'call';
  save(activity: Activity): void;
  onEdit(): void;

  // call mode props
  isHost?: boolean;
  isStarted?: boolean;
  onStart?(): void;
}

export default function ActivitiesCard({
  activity,
  mode,
  isHost,
  isStarted,
  save,
  onEdit,
  onStart,
}: PropTypes) {
  const classes = useStyles();

  const handleStartClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onStart?.();
    },
    [onStart],
  );

  const handleSettingsClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!isStarted) {
        onEdit();
      }
    },
    [onEdit, isStarted],
  );

  const handleNameChange = useCallback(
    (newName: string) => {
      save({
        ...activity,
        name: newName,
      });
    },
    [save, activity],
  );

  return (
    <Card className={classes.card}>
      <div className={classes.content}>
        <EditableTitle
          disabled={(mode === 'call' && !isHost) || isStarted}
          title={activity.name}
          onChange={handleNameChange}
          variant="h2"
          validationSchema={NameSchema}
        />
        <Typography variant="body1" className={classes.activityType}>
          {activity.type}
        </Typography>
      </div>
      <div className={classes.buttonContainer}>
        {mode === 'edit' && (
          <Tooltip title="Edit activity" placement="left">
            <Button variant="outlined" color="secondary" onClick={handleSettingsClick}>
              <EditIcon />
            </Button>
          </Tooltip>
        )}

        {mode === 'call' && isHost && (
          <>
            {!isStarted && (
              <Tooltip title="Edit activity" placement="bottom">
                <Button variant="outlined" color="secondary" onClick={handleSettingsClick}>
                  <EditIcon />
                </Button>
              </Tooltip>
            )}

            <Tooltip title={isStarted ? 'Activity started' : 'Start activity'} placement="bottom">
              <div>
                <Button
                  variant="contained"
                  disabled={isStarted}
                  color="secondary"
                  onClick={handleStartClick}
                >
                  <StartIcon />
                </Button>
              </div>
            </Tooltip>
          </>
        )}
      </div>
    </Card>
  );
}
