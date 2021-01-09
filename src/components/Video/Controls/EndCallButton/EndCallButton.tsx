import React, { useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import CallEnd from '@material-ui/icons/CallEnd';
import { Fab, Tooltip } from '@material-ui/core';

import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useCallContext from '~/hooks/useCallContext/useCallContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  }),
);

export default function EndCallButton(props: object) {
  const classes = useStyles();
  const { room } = useVideoContext();
  const { endCall } = useCallContext();

  const handleEndCall = useCallback(() => {
    room.disconnect();
    endCall();
  }, [endCall, room]);

  return (
    <Tooltip
      title={'End Call'}
      onClick={handleEndCall}
      placement="top"
      PopperProps={{ disablePortal: true }}
    >
      <Fab className={classes.fab} color="secondary" {...props}>
        <CallEnd />
      </Fab>
    </Tooltip>
  );
}
