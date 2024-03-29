import React, { useEffect, useRef } from 'react';

import { ScreenShare, StopScreenShare } from '@material-ui/icons';
import { Tooltip, Fab } from '@material-ui/core';

import useScreenShareParticipant from '~/hooks/Video/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import { useStyles } from '../styles';

export const SCREEN_SHARE_TEXT = 'Share Screen';
export const STOP_SCREEN_SHARE_TEXT = 'Stop Sharing Screen';
export const SHARE_IN_PROGRESS_TEXT = 'Cannot share screen when another user is sharing';
export const SHARE_NOT_SUPPORTED_TEXT = 'Screen sharing is not supported with this browser';

export default function ToggleScreenShareButton(props: { disabled?: boolean }) {
  const classes = useStyles();
  const { room, isScreenShared, toggleScreenShare } = useVideoContext();
  const screenShareParticipant = useScreenShareParticipant();
  const cleanUpScreenShare = useRef<() => void>();

  // when this component is unmounted, turn screen sharing off
  useEffect(() => () => cleanUpScreenShare.current?.(), []);
  useEffect(() => {
    cleanUpScreenShare.current = () => {
      if (isScreenShared) {
        toggleScreenShare();
      }
    };
  }, [isScreenShared, toggleScreenShare]);

  const disableScreenShareButton =
    screenShareParticipant && screenShareParticipant !== room.localParticipant;
  const isScreenShareSupported = navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
  const isDisabled = props.disabled || disableScreenShareButton || !isScreenShareSupported;

  let tooltipMessage = SCREEN_SHARE_TEXT;

  if (isScreenShared) {
    tooltipMessage = STOP_SCREEN_SHARE_TEXT;
  }

  if (disableScreenShareButton) {
    tooltipMessage = SHARE_IN_PROGRESS_TEXT;
  }

  if (!isScreenShareSupported) {
    tooltipMessage = SHARE_NOT_SUPPORTED_TEXT;
  }

  return (
    <Tooltip
      title={tooltipMessage}
      placement="top"
      PopperProps={{ disablePortal: true }}
      style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
    >
      <div data-testid="hover-div">
        {/* The div element is needed because a disabled button will not emit hover events and we want to display
          a tooltip when screen sharing is disabled */}
        <Fab className={classes.fab} onClick={toggleScreenShare} disabled={isDisabled}>
          {isScreenShared ? (
            <StopScreenShare data-testid="stop-icon" />
          ) : (
            <ScreenShare data-testid="screenshare-icon" />
          )}
        </Fab>
      </div>
    </Tooltip>
  );
}
