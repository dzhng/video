import React, { useState, useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, Card, IconButton, Tooltip } from '@material-ui/core';
import {
  CloseOutlined as CloseIcon,
  SettingsBackupRestoreOutlined as RestartIcon,
} from '@material-ui/icons';
import { ActivityTypeConfig } from '../Types/Types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import ConfirmRestartModal from './ConfirmRestartModal';
import ErrorDisplay from './Error';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: theme.shadows[7],
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

      // not really needed but just in case
      // NOTE: children should handle overflow scroll
      overflow: 'hidden',
      // align children to 100% height
      display: 'flex',
    },
  }),
);

export default function ActivityDisplay() {
  const classes = useStyles();
  const {
    call,
    currentActivity,
    endActivity,
    updateActivityData,
    hasActivityStarted,
  } = useCallContext();
  const [confirmRestart, setConfirmRestart] = useState(false);

  const handleRestartActivity = useCallback(() => {
    // no need to show anything if activity don't have any data submitted
    if (!currentActivity || !hasActivityStarted(currentActivity)) {
      return;
    }

    setConfirmRestart(true);
  }, [currentActivity, hasActivityStarted]);

  const handleRestartConfirm = useCallback(() => {
    if (!currentActivity) {
      return;
    }

    // to restart, just clear the activity data for that activity
    updateActivityData(currentActivity, null, null);
  }, [updateActivityData, currentActivity]);

  if (!call || !currentActivity) {
    return <ErrorDisplay />;
  }

  const config = ActivityTypeConfig.find((_config) => _config.type === currentActivity.type);
  if (!config) {
    return <ErrorDisplay />;
  }

  return (
    <>
      <Card className={classes.container}>
        <div className={classes.header}>
          <Typography variant="h2">
            <b>{currentActivity.name}</b>
          </Typography>

          <Tooltip title="Restart activity" placement="bottom">
            <IconButton size="small" onClick={handleRestartActivity}>
              <RestartIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Close activity - your progress will be saved" placement="bottom">
            <IconButton size="small" onClick={endActivity}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div className={classes.content}>{config.display}</div>
      </Card>

      {confirmRestart && (
        <ConfirmRestartModal
          open={confirmRestart}
          onClose={() => setConfirmRestart(false)}
          onConfirm={handleRestartConfirm}
        />
      )}
    </>
  );
}
