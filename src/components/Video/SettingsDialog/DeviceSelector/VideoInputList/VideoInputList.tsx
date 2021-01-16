import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import { LocalVideoTrack } from 'twilio-video';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_VIDEO_INPUT_KEY } from '~/constants';
import VideoTrack from '~/components/Video/VideoTrack/VideoTrack';
import useMediaStreamTrack from '~/hooks/Video/useMediaStreamTrack/useMediaStreamTrack';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      '& h5': {
        marginBottom: theme.spacing(1),
      },
    },
    preview: {
      margin: '0.5em 0',
      marginTop: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
      transform: 'translateZ(0)',
      boxShadow: theme.shadows[4],
      maxHeight: 350,
    },
  }),
);

export default function VideoInputList() {
  const classes = useStyles();
  const { localTracks, devices } = useVideoContext();
  const videoInputDevices = devices.videoInput;

  const localVideoTrack = localTracks.find((track) => track.kind === 'video') as LocalVideoTrack;
  const mediaStreamTrack = useMediaStreamTrack(localVideoTrack);
  const localVideoInputDeviceId = mediaStreamTrack?.getSettings().deviceId;

  function replaceTrack(newDeviceId: string) {
    window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, newDeviceId);
    localVideoTrack.restart({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      deviceId: { exact: newDeviceId },
    });
  }

  return (
    <div className={classes.container}>
      {videoInputDevices.length > 1 ? (
        <FormControl fullWidth>
          <Typography variant="h5">
            <b>Video Input</b>
          </Typography>
          <Select
            fullWidth
            margin="dense"
            variant="outlined"
            onChange={(e) => replaceTrack(e.target.value as string)}
            value={localVideoInputDeviceId || ''}
            data-testid="select-menu"
          >
            {videoInputDevices.map((device) => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Typography variant="h5">
            <b>Video Input</b>
          </Typography>
          <Typography data-testid="default-track-name">
            {localVideoTrack?.mediaStreamTrack.label || 'No Local Video'}
          </Typography>
        </>
      )}
      {localVideoTrack && (
        <div className={classes.preview}>
          <VideoTrack isLocal track={localVideoTrack} />
        </div>
      )}
    </div>
  );
}
