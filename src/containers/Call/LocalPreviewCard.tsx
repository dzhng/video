import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import LocalVideoPreview from '~/components/Video/LocalVideoPreview/LocalVideoPreview';
import Controls from '~/components/Video/Controls/Controls';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '600px',
      height: '80vh',
    },
    videoContainer: {
      flexGrow: 1,
      overflow: 'hidden',
      backgroundColor: 'black',
    },
    controlsContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(1),
    },
  }),
);

export default function LocalPreviewCard({
  className,
  actionBar,
}: {
  className?: string;
  actionBar?: JSX.Element;
}) {
  const classes = useStyles();
  const [mediaError, setMediaError] = useState<Error>();
  const { getAudioAndVideoTracks } = useVideoContext();

  useEffect(() => {
    getAudioAndVideoTracks().catch((error) => {
      console.log('Error acquiring local media:');
      console.dir(error);
      setMediaError(error);
    });
  }, [getAudioAndVideoTracks]);

  return (
    <>
      <Card className={clsx(classes.card, className)}>
        <div className={classes.videoContainer}>
          <LocalVideoPreview />
        </div>
        <div className={classes.controlsContainer}>
          <Controls />
        </div>
        {actionBar}
      </Card>

      <MediaErrorSnackbar error={mediaError} />
    </>
  );
}
