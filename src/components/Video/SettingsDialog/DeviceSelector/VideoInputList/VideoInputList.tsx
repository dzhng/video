import React from 'react';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import { LocalVideoTrack } from 'twilio-video';
import { makeStyles } from '@material-ui/core/styles';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_VIDEO_INPUT_KEY } from '~/constants';
import VideoTrack from '~/components/Video/VideoTrack/VideoTrack';
import useMediaStreamTrack from '~/hooks/Video/useMediaStreamTrack/useMediaStreamTrack';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import { useVideoInputDevices } from '~/hooks/Video/deviceHooks/deviceHooks';

const useStyles = makeStyles({
  preview: {
    width: '150px',
    margin: '0.5em 0',
  },
});

export default function VideoInputList() {
  const classes = useStyles();
  const videoInputDevices = useVideoInputDevices();
  const { localTracks } = useVideoContext();

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
    <div>
      {videoInputDevices.length > 1 ? (
        <FormControl>
          <Typography variant="h6">Video Input:</Typography>
          <Select
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
          <Typography variant="h6">Video Input:</Typography>
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