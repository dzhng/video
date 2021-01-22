import React, { useCallback, useRef } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useHotkeys } from 'react-hotkeys-hook';

import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';

import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),

      '&.Mui-disabled': {
        backgroundColor: theme.palette.grey[400],
      },
    },
  }),
);

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

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 300) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  // setup hotkeys to toggle audio
  useHotkeys(
    'v',
    (e) => {
      e.preventDefault();
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
    [toggleVideo, isVideoEnabled, setPopperMessage],
  );

  return (
    <Tooltip
      title={isVideoEnabled ? 'Mute Video' : 'Unmute Video'}
      placement="top"
      PopperProps={{ disablePortal: true }}
    >
      {/* Wrapping <Fab/> in <div/> so that tooltip can wrap a disabled element */}
      <div>
        <Fab
          className={classes.fab}
          onClick={toggleVideo}
          disabled={disabled || shouldDisableVideoToggle}
        >
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
