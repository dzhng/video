import React from 'react';
import { LocalAudioTrack } from 'twilio-video';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import useMediaStreamTrack from '~/hooks/Video/useMediaStreamTrack/useMediaStreamTrack';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import LocalAudioLevelIndicator from '~/components/Video/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import { SELECTED_AUDIO_INPUT_KEY } from '~/constants';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',

      '& h5': {
        marginBottom: theme.spacing(1),
      },
    },
    indicatorWrapper: {
      width: 30,
      height: 30,
      padding: '3px',
      backgroundColor: theme.palette.grey[800],
      boxShadow: theme.shadows[4],
      borderRadius: 15,
      marginLeft: theme.spacing(1),
      marginBottom: 4,
    },
  }),
);

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
      {audioInputDevices.length > 1 ? (
        <FormControl fullWidth>
          <Typography variant="h5">
            <b>Audio Input</b>
          </Typography>
          <Select
            fullWidth
            margin="dense"
            variant="outlined"
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
        <div>
          <Typography variant="h5">
            <b>Audio Input</b>
          </Typography>
          <Typography variant="body1" data-testid="default-track-name">
            {localAudioTrack?.mediaStreamTrack.label || 'No Local Audio'}
          </Typography>
        </div>
      )}
      <div className={classes.indicatorWrapper}>
        <LocalAudioLevelIndicator />
      </div>
    </div>
  );
}
