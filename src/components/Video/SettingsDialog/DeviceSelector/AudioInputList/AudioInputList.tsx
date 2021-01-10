import React from 'react';
import { LocalAudioTrack } from 'twilio-video';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useMediaStreamTrack from '~/hooks/Video/useMediaStreamTrack/useMediaStreamTrack';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import LocalAudioLevelIndicator from '~/components/Video/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import { SELECTED_AUDIO_INPUT_KEY } from '~/constants';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
});

export default function AudioInputList() {
  const classes = useStyles();
  const { localTracks, devices } = useVideoContext();
  const audioInputDevices = devices.audioInput;

  const localAudioTrack = localTracks.find((track) => track.kind === 'audio') as LocalAudioTrack;
  const mediaStreamTrack = useMediaStreamTrack(localAudioTrack);
  const localAudioInputDeviceId = mediaStreamTrack?.getSettings().deviceId;

  function replaceTrack(newDeviceId: string) {
    window.localStorage.setItem(SELECTED_AUDIO_INPUT_KEY, newDeviceId);
    localAudioTrack?.restart({ deviceId: { exact: newDeviceId } });
  }

  return (
    <div className={classes.container}>
      <div className="inputSelect">
        {audioInputDevices.length > 1 ? (
          <FormControl fullWidth>
            <Typography variant="h6">Audio Input:</Typography>
            <Select
              onChange={(e) => replaceTrack(e.target.value as string)}
              value={localAudioInputDeviceId || ''}
              data-testid="select-menu"
            >
              {audioInputDevices.map((device) => (
                <MenuItem value={device.deviceId} key={device.deviceId}>
                  {device.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <>
            <Typography variant="h6">Audio Input:</Typography>
            <Typography data-testid="default-track-name">
              {localAudioTrack?.mediaStreamTrack.label || 'No Local Audio'}
            </Typography>
          </>
        )}
      </div>
      <LocalAudioLevelIndicator />
    </div>
  );
}
