import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import { Participant } from 'twilio-video';
import useParticipantIsReconnecting from '~/hooks/Video/useParticipantIsReconnecting/useParticipantIsReconnecting';

const useStyles = makeStyles({
  indicator: {
    width: '5px',
    height: '5px',
    borderRadius: '100%',
    background: '#0c0',
    display: 'inline-block',
    marginRight: '3px',
    flexShrink: 0,
  },
  isReconnecting: {
    background: '#ffb100',
  },
});

export default function ParticipantConnectionIndicator({
  participant,
}: {
  participant: Participant;
}) {
  const isReconnecting = useParticipantIsReconnecting(participant);
  const classes = useStyles();
  return (
    <Tooltip
      data-testid="tooltip"
      title={isReconnecting ? 'Participant is reconnecting' : 'Participant is connected'}
    >
      <span
        data-testid="indicator"
        className={clsx(classes.indicator, { [classes.isReconnecting]: isReconnecting })}
      ></span>
    </Tooltip>
  );
}
