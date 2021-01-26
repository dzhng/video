import React from 'react';
import { get, entries } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { CallData, ActivityDataKey } from '~/firebase/rtdb-types';
import type { Activity } from '~/firebase/schema-types';
import { ActivityTypeConfig } from '~/components/Activities/Types/Types';

interface FinishedActivityType {
  template: Activity;
  data: CallData;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    activityContainer: {
      marginBottom: theme.spacing(2),
    },
    activityInfo: {
      display: 'flex',
      alignItems: 'center',

      '& h5': {
        color: theme.palette.secondary.main,
        fontWeight: 'bold',
        flexGrow: 1,
      },
      '& p': {
        color: theme.palette.grey[600],
        textAlign: 'right',
      },
    },
    activity: {
      ...theme.customMixins.scrollBar,
      width: '100%',
      borderRadius: theme.shape.borderRadius,
      border: theme.dividerBorder,
      marginTop: theme.spacing(1),

      // activities depend on flex display to show properly
      display: 'flex',
      minHeight: 350,
    },
  }),
);

const FinishedActivity = ({ finishedActivity }: { finishedActivity: FinishedActivityType }) => {
  const classes = useStyles();
  const config = ActivityTypeConfig.find((a) => a.type === finishedActivity.template.type);

  return config && config.summary ? (
    <div className={classes.activityContainer}>
      <div className={classes.activityInfo}>
        <Typography variant="h5">{finishedActivity.template.name}</Typography>
        <Typography variant="body1">{finishedActivity.template.type}</Typography>
      </div>

      <div className={classes.activity}>
        {config.summary(finishedActivity.template, finishedActivity.data)}
      </div>
    </div>
  ) : null;
};

export default function Activities({
  data,
  activities,
}: {
  data: CallData;
  activities: Activity[];
}) {
  const classes = useStyles();

  const allActivityData = get(data, [ActivityDataKey]) as CallData;
  const finishedActivities = entries(allActivityData)
    .map(([activityId, activityData]) => {
      const template = activities.find((config) => config.id === activityId);
      if (!template) {
        return undefined;
      }

      return {
        template,
        data: activityData,
      };
    })
    .filter((v) => !!v) as FinishedActivityType[];

  if (finishedActivities.length === 0) {
    return (
      <Typography variant="body1" style={{ color: '#888' }}>
        No activities was started during this call.
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h2">Activities</Typography>
      <div className={classes.container}>
        {finishedActivities.map((fa) => (
          <FinishedActivity key={fa.template.id} finishedActivity={fa} />
        ))}
      </div>
    </>
  );
}
