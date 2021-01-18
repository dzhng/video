import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import useRoomState from '~/hooks/Video/useRoomState/useRoomState';
import { useAppState } from '~/state';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';

import EndCallButton from './EndCallButton/EndCallButton';
import ToggleAudioButton from './ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from './ToggleVideoButton/ToggleVideoButton';
import ToggleScreenShareButton from './ToggleScreenShareButton/ToggleScreenShareButton';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      width: 'min-content',
      zIndex: 1,
      transition: 'opacity 1.2s, transform 1.2s, visibility 0s 1.2s',
      opacity: 0,
      visibility: 'hidden',

      '&.showControls, &:hover': {
        transition: 'opacity 0.6s, transform 0.6s, visibility 0s',
        opacity: 1,
        visibility: 'visible',
      },
    },
  }),
);

export default function Controls({ showControls = true }: { showControls?: boolean }) {
  const classes = useStyles();
  const roomState = useRoomState();
  const { isFetching } = useAppState();
  const { isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const isReconnecting = roomState === 'reconnecting';
  const isScreenShareSupported = navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting || isReconnecting;

  return (
    <div data-testid="container" className={clsx(classes.container, { showControls })}>
      <ToggleAudioButton disabled={disableButtons} />
      <ToggleVideoButton disabled={disableButtons} />
      {roomState !== 'disconnected' && isScreenShareSupported && <ToggleScreenShareButton />}
      {roomState !== 'disconnected' && <EndCallButton />}
    </div>
  );
}
