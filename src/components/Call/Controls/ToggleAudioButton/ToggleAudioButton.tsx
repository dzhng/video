import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Fab, Tooltip } from '@material-ui/core';
import { Mic, MicOff } from '@material-ui/icons';

import useLocalAudioToggle from '~/hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '~/hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  }),
);

export default function ToggleAudioButton(props: { disabled?: boolean }) {
  const classes = useStyles();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some((track) => track.kind === 'audio');
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();

  return (
    <Tooltip
      title={isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
      placement="top"
      PopperProps={{ disablePortal: true }}
    >
      {/* Wrapping <Fab/> in <div/> so that tooltip can wrap a disabled element */}
      <div>
        <Fab
          className={classes.fab}
          onClick={toggleAudioEnabled}
          disabled={!hasAudioTrack || props.disabled}
          data-cy-audio-toggle
        >
          {isAudioEnabled ? <Mic data-testid="mic-icon" /> : <MicOff data-testid="micoff-icon" />}
        </Fab>
      </div>
    </Tooltip>
  );
}
