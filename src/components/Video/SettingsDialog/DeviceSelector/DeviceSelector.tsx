import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import VideoInputList from './VideoInputList/VideoInputList';
import AudioInputList from './AudioInputList/AudioInputList';
import AudioOutputList from './AudioOutputList/AudioOutputList';

const useStyles = makeStyles({
  listSection: {
    margin: '2em 0',
    '&:first-child': {
      margin: '1em 0 2em 0',
    },
  },
});

export function DeviceSelector() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.listSection}>
        <AudioInputList />
      </div>
      <div className={classes.listSection}>
        <AudioOutputList />
      </div>
      <div className={classes.listSection}>
        <VideoInputList />
      </div>
    </>
  );
}
