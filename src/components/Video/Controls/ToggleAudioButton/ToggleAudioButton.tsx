import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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
  }),
);

export default function ToggleAudioButton({
  disabled,
  setPopperOpen,
  setPopperMessage,
}: {
  disabled?: boolean;
  setPopperOpen(open: boolean): void;
  setPopperMessage(node: React.ReactNode, autoClose?: boolean): void;
}) {
  const classes = useStyles();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some((track) => track.kind === 'audio');
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();

  // setup hotkeys for push to talk
  // on key down, enable audio, on key up, disable audio
  useHotkeys(
    'space',
    (e) => {
      e.preventDefault();
      if (!hasAudioTrack || disabled) {
        return;
      }

      setPopperOpen(true);
      setPopperMessage(
        <>
          <b>Push-to-Talk mode:</b> hold <b>[space]</b> to speak, release <b>[space]</b> to mute.
        </>,
      );
      toggleAudioEnabled(true);
    },
    { keydown: true },
    [toggleAudioEnabled, setPopperOpen],
  );
  useHotkeys(
    'space',
    (e) => {
      e.preventDefault();
      if (!hasAudioTrack || disabled) {
        return;
      }

      setPopperOpen(false);
      toggleAudioEnabled(false);
    },
    { keyup: true },
    [toggleAudioEnabled, setPopperOpen],
  );
  // prevent default space behavior on press
  // have it here just in case
  useHotkeys('space', (e) => e.preventDefault());

  // setup hotkeys to toggle audio
  useHotkeys(
    'a',
    (e) => {
      e.preventDefault();
      if (!hasAudioTrack || disabled) {
        return;
      }

      toggleAudioEnabled();
      setPopperMessage(
        isAudioEnabled ? (
          <>
            Audio <b>disabled</b>.
          </>
        ) : (
          <>
            Audio <b>enabled</b>.
          </>
        ),
        true,
      );
    },
    [toggleAudioEnabled, isAudioEnabled, setPopperMessage],
  );

  return (
    <Tooltip
      title={isAudioEnabled ? 'Mute Audio [A]' : 'Unmute Audio [A]'}
      placement="top"
      PopperProps={{ disablePortal: true }}
    >
      {/* Wrapping <Fab/> in <div/> so that tooltip can wrap a disabled element */}
      <div>
        <Fab
          className={classes.fab}
          onClick={() => toggleAudioEnabled()}
          disabled={!hasAudioTrack || disabled}
          data-cy-audio-toggle
        >
          {isAudioEnabled ? <Mic data-testid="mic-icon" /> : <MicOff data-testid="micoff-icon" />}
        </Fab>
      </div>
    </Tooltip>
  );
}
