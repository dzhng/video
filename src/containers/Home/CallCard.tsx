import React from 'react';
import { Typography, Card } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { LocalModel, Call, FbDate } from '~/firebase/schema-types';
import firebase from '~/utils/firebase';
import { formatFutureDate, formatPastDate } from '~/utils';

const useStyles = makeStyles((theme) =>
  createStyles({
    callCard: {
      cursor: 'pointer',
      padding: theme.spacing(2),
    },
  }),
);

const formatStartTime = (startTime: FbDate) => {
  const date = (startTime as firebase.firestore.Timestamp).toDate();
  if (date.getTime() > Date.now()) {
    return formatFutureDate(date);
  } else {
    return formatPastDate(date);
  }
};

export default function CallCard({ call }: { call: LocalModel<Call> }) {
  const classes = useStyles();

  return (
    <Card className={classes.callCard}>
      <Typography variant="h5">{call.name}</Typography>
      <Typography variant="body1">{call.guestEmails?.length} invited attendees</Typography>
      <Typography variant="body2">
        <b>Starting time:</b> {call.startTime ? formatStartTime(call.startTime) : 'not set'}
      </Typography>
    </Card>
  );
}
