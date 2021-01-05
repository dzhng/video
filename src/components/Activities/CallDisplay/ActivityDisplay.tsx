import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, Card } from '@material-ui/core';
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
      padding: theme.spacing(1),
      backgroundColor: theme.palette.grey[300],
    },
    content: {
      flexGrow: 1,
    },
  }),
);

export default function ActivityDisplay() {
  const classes = useStyles();
  const { call, template } = useCallContext();

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
        <Typography variant="h2">{activity.name}</Typography>
      </div>
      <div className={classes.content}>{config.display}</div>
    </Card>
  );
}
