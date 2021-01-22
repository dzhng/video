import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Popper, Fade, Card, Typography } from '@material-ui/core';
import { useHotkeys } from 'react-hotkeys-hook';
import { Fab, Tooltip } from '@material-ui/core';
import { Mic, MicOff } from '@material-ui/icons';

import useLocalAudioToggle from '~/hooks/Video/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
    popper: {
      padding: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
      color: 'white',
      boxShadow: theme.shadows[7],
    },
  }),
);

export default function ToggleAudioButton(props: {
  disabled?: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const classes = useStyles();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some((track) => track.kind === 'audio');
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const [isPushToTalk, setIsPushToTalk] = useState(false);

  // setup hotkeys for push to talk
  // on key down, enable audio, on key up, disable audio
  useHotkeys(
    'space',
    (e) => {
      e.preventDefault();
      setIsPushToTalk(true);
      toggleAudioEnabled(true);
    },
    { keydown: true },
  );
  useHotkeys(
    'space',
    (e) => {
      e.preventDefault();
      setIsPushToTalk(false);
      toggleAudioEnabled(false);
    },
    { keyup: true },
  );
  // prevent default space behavior on press
  // have it here just in case
  useHotkeys('space', (e) => e.preventDefault());

  return (
    <>
      <Tooltip
        title={isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
        placement="top"
        PopperProps={{ disablePortal: true }}
      >
        {/* Wrapping <Fab/> in <div/> so that tooltip can wrap a disabled element */}
        <div>
          <Fab
            className={classes.fab}
            onClick={() => toggleAudioEnabled()}
            disabled={!hasAudioTrack || props.disabled}
            data-cy-audio-toggle
          >
            {isAudioEnabled ? <Mic data-testid="mic-icon" /> : <MicOff data-testid="micoff-icon" />}
          </Fab>
        </div>
      </Tooltip>

      <Popper open={isPushToTalk} anchorEl={props.containerRef.current} placement="top" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card className={classes.popper}>
              <Typography variant="body1">
                <b>Push-to-Talk mode:</b> hold <b>[space]</b> to speak, release <b>[space]</b> to
                mute.
              </Typography>
            </Card>
          </Fade>
        )}
      </Popper>
    </>
  );
}
