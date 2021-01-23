import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { formatPastDate, formatDuration } from '~/utils';
import { LocalModel, Call } from '~/firebase/schema-types';
import useUserInfo from '~/hooks/useUserInfo/useUserInfo';
import UserAvatar from '~/components/UserAvatar/UserAvatar';
import type { ParticipantRecord } from './types';

const useStyles = makeStyles((theme) =>
  createStyles({
    participant: {
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      width: 30,
      height: 30,
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

  const joinedCallTime = formatDuration(Math.max(participant.joinTime - startTime.getTime(), 0));

  return (
    <div className={classes.participant}>
      {user ? (
        <UserAvatar className={classes.avatar} user={user} />
      ) : (
        <Skeleton className={classes.avatar} />
      )}
      <Typography variant="body1">{user?.displayName}</Typography>
      <Typography variant="body1">{formatDuration(participant.duration)} minutes</Typography>
      <Typography variant="body1">
        Joined call {joinedCallTime} minutes after it started.
      </Typography>
    </div>
  );
};

export default function CallCard({
  call,
  participants,
}: {
  call: LocalModel<Call>;
  participants: ParticipantRecord[];
}) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h2">Duration</Typography>
        <Typography variant="body1">{formatDuration(call.duration ?? 0)} minutes</Typography>
        <Typography variant="body1">{formatPastDate((call.createdAt as any).toDate())}</Typography>

        <Typography variant="h2">Participants</Typography>
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
