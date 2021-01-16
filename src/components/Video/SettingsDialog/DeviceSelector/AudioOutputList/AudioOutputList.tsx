import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import useActiveSinkId from '~/hooks/Video/useActiveSinkId/useActiveSinkId';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      '& h5': {
        marginBottom: theme.spacing(1),
      },
    },
  }),
);

export default function AudioOutputList() {
  const classes = useStyles();
  const { devices } = useVideoContext();
  const { activeSinkId, setActiveSinkId } = useActiveSinkId();

  const audioOutputDevices = devices.audioOutput;
  const activeOutputLabel = audioOutputDevices.find((device) => device.deviceId === activeSinkId)
    ?.label;

  return (
    <div className={classes.container}>
      {audioOutputDevices.length > 1 ? (
        <FormControl fullWidth>
          <Typography variant="h5">
            <b>Audio Output</b>
          </Typography>
          <Select
            fullWidth
            margin="dense"
            variant="outlined"
            onChange={(e) => setActiveSinkId(e.target.value as string)}
            value={activeSinkId}
            data-testid="select-menu"
          >
            {audioOutputDevices.map((device) => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Typography variant="h5">
            <b>Audio Output</b>
          </Typography>
          <Typography data-testid="output-label">
            {activeOutputLabel || 'System Default Audio Output'}
          </Typography>
        </>
      )}
    </div>
  );
}
