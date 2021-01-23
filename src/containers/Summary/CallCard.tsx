import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Divider } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { formatPastDate, formatDuration } from '~/utils';
import { LocalModel, Call, Template } from '~/firebase/schema-types';
import useUserInfo from '~/hooks/useUserInfo/useUserInfo';
import UserAvatar from '~/components/UserAvatar/UserAvatar';
import type { ParticipantRecord } from './types';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      '& h2': {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        fontWeight: 'bold',
      },
    },
    callStats: {
      marginBottom: theme.spacing(1),
      color: theme.palette.grey[800],
    },
    participant: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
    },
    avatar: {
      width: 30,
      height: 30,
      marginRight: theme.spacing(1),
    },
    participantStats: {
      flexGrow: 1,
      textAlign: 'right',
      display: 'flex',
      flexDirection: 'column',
      color: theme.palette.grey[700],
    },
  }),
);

const Participant = ({
  participant,
  startTime,
}: {
  participant: ParticipantRecord;
  startTime: Date;
}) => {
  const classes = useStyles();
  const user = useUserInfo(participant.uid);

  const timeDiffSeconds = (participant.joinTime - startTime.getTime()) / 1000;
  const joinedCallTime = formatDuration(Math.max(timeDiffSeconds, 0));

  return (
    <div className={classes.participant}>
      {user ? (
        <UserAvatar className={classes.avatar} user={user} />
      ) : (
        <Skeleton className={classes.avatar} />
      )}
      <Typography variant="body1">
        <b>{user?.displayName}</b>
      </Typography>

      <div className={classes.participantStats}>
        <div>
          <b>In call for:</b> {formatDuration(participant.duration)} minutes
        </div>
        <div>
          {joinedCallTime <= 0
            ? 'Joined call when it started'
            : 'Joined call {joinedCallTime} minutes after it started'}
        </div>
      </div>
    </div>
  );
};

export default function CallCard({
  template,
  call,
  participants,
}: {
  template?: LocalModel<Template>;
  call: LocalModel<Call>;
  participants: ParticipantRecord[];
}) {
  const classes = useStyles();

  return (
    <Card className={classes.container}>
      <CardContent>
        <Typography variant="h2">Info</Typography>
        <div className={classes.callStats}>
          <Typography variant="body1">
            <b>Room:</b> {template?.name}
          </Typography>
          {call.isFinished ? (
            <Typography variant="body1">
              <b>Duration:</b> {formatDuration(call.duration ?? 0)} minutes
            </Typography>
          ) : (
            <Typography variant="body1">
              <b>Call in progress...</b>
            </Typography>
          )}
          <Typography variant="body1">
            <b>Created:</b> {formatPastDate((call.createdAt as any).toDate())}
          </Typography>
        </div>

        <Divider />

        <Typography variant="h2">Participants ({participants.length})</Typography>
        {participants.map((participant) => (
          <Participant
            key={participant.uid}
            participant={participant}
            startTime={(call.createdAt as any).toDate()}
          />
        ))}
      </CardContent>
    </Card>
  );
}
