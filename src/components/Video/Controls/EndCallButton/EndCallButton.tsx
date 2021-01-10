import React, { useCallback, useState } from 'react';
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
  const { isHost, endCall } = useCallContext();
  const [isEndingCall, setIsEndingCall] = useState(false);

  const handleEndCall = useCallback(async () => {
    setIsEndingCall(true);
    if (isHost) {
      await endCall().catch(() => setIsEndingCall(false));
      room.disconnect();
    } else {
      room.disconnect();
    }
  }, [isHost, endCall, room]);

  return (
    <Tooltip
      title={'End Call'}
      onClick={handleEndCall}
      placement="top"
      PopperProps={{ disablePortal: true }}
    >
      <div>
        <Fab className={classes.fab} color="secondary" disabled={isEndingCall} {...props}>
          <CallEnd />
        </Fab>
      </div>
    </Tooltip>
  );
}
