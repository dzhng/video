import React, { useCallback, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Fab, Tooltip } from '@material-ui/core';
import { Videocam, VideocamOff } from '@material-ui/icons';

import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import { useStyles } from '../styles';

export default function ToggleVideoButton({
  disabled,
  setPopperMessage,
}: {
  disabled?: boolean;
  setPopperMessage(node: React.ReactNode, autoClose?: boolean): void;
}) {
  const classes = useStyles();
  const { isVideoEnabled, toggleVideoEnabled, shouldDisableVideoToggle } = useVideoContext();
  const lastClickTimeRef = useRef(0);
  const disableVideoToggle = disabled || shouldDisableVideoToggle;

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 300) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  useHotkeys(
    'v',
    (e) => {
      e.preventDefault();
      if (disableVideoToggle) {
        return;
      }

      toggleVideo();
      setPopperMessage(
        isVideoEnabled ? (
          <>
            Video <b>disabled</b>.
          </>
        ) : (
          <>
            Video <b>enabled</b>.
          </>
        ),
        true,
      );
    },
    [disableVideoToggle, toggleVideo, isVideoEnabled, setPopperMessage],
  );

  return (
    <Tooltip
      title={isVideoEnabled ? 'Turn Off Video [V]' : 'Turn On Video [V]'}
      placement="top"
      PopperProps={{ disablePortal: true }}
    >
      {/* Wrapping <Fab/> in <div/> so that tooltip can wrap a disabled element */}
      <div>
        <Fab className={classes.fab} onClick={toggleVideo} disabled={disableVideoToggle}>
          {isVideoEnabled ? (
            <Videocam data-testid="video-icon" />
          ) : (
            <VideocamOff data-testid="videooff-icon" />
          )}
        </Fab>
      </div>
    </Tooltip>
  );
}
