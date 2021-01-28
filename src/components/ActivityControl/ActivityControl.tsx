import React from 'react';
import { Card } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import ActivitiesBar from '~/components/Activities/ActivitiesBar/ActivitiesBar';
import Interactions from '~/components/Call/Interactions';

const useStyles = makeStyles((theme) =>
  createStyles({
    backButton: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    drawerPaper: {
      ...theme.customMixins.activitiesBarMini,
      display: 'flex',
      flexDirection: 'column',
    },
    actionArea: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',

      // space the children out with margins
      '& >div': {
        margin: theme.spacing(1),
      },
      // if only child, go 100% height
      '& >div:first-child:last-child': {
        maxHeight: '100%',
      },
      '& >div:first-child': {
        // leave at least enough height to show the button
        minHeight: 84,
      },
      '& >div:nth-child(2)': {
        flexBasis: '500px',
        minHeight: 250,
        flexGrow: 1,
        marginTop: 0,
      },
    },
    activityCard: {
      ...theme.customMixins.scrollBar,
      overflowY: 'auto',
    },
  }),
);

export default function ActivityControl() {
  const classes = useStyles();
  const { template, isHost, currentActivity, startActivity, hasActivityStarted } = useCallContext();

  return (
    <div className={classes.actionArea}>
      <Card className={classes.activityCard}>
        <ActivitiesBar
          template={template}
          mode={isHost ? 'call' : 'view'}
          currentActivity={currentActivity}
          startActivity={startActivity}
          hasActivityStarted={hasActivityStarted}
        />
      </Card>
      <Interactions />
    </div>
  );
}
