import React, { useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, Card, IconButton, Tooltip } from '@material-ui/core';
import {
  CloseOutlined as CloseIcon,
  SettingsBackupRestoreOutlined as RestartIcon,
} from '@material-ui/icons';
import { ActivityTypeConfig } from '../Types/Types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import ErrorDisplay from './Error';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.grey[300],
      justifyContent: 'flex-end',
      alignItems: 'center',

      '& h2': {
        flexGrow: 1,
      },

      '& button': {
        marginLeft: theme.spacing(1),
      },
    },
    content: {
      flexGrow: 1,
      backgroundColor: 'black',
    },
  }),
);

export default function ActivityDisplay() {
  const classes = useStyles();
  const { call, template, currentActivity, endActivity, updateActivity } = useCallContext();

  const handleRestartActivity = useCallback(() => {
    if (!currentActivity) {
      return;
    }

    // to restart, just clear the activity data for that activity
    updateActivity(currentActivity, null, {});
  }, [updateActivity, currentActivity]);

  if (!call || !call.currentActivityId) {
    return <ErrorDisplay />;
  }

  const activity = template.activities.find((act) => act.id === call.currentActivityId);
  if (!activity) {
    return <ErrorDisplay />;
  }

  const config = ActivityTypeConfig.find((_config) => _config.type === activity.type);
  if (!config) {
    return <ErrorDisplay />;
  }

  return (
    <Card className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h2">
          <b>{activity.name}</b>
        </Typography>

        <Tooltip title="Restart activity" placement="bottom">
          <IconButton size="small" onClick={handleRestartActivity}>
            <RestartIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Close activity" placement="bottom">
          <IconButton size="small" onClick={endActivity}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.content}>{config.display}</div>
    </Card>
  );
}
