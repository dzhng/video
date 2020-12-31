import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import LocalVideoPreview from '~/components/Video/LocalVideoPreview/LocalVideoPreview';
import ToggleAudioButton from '~/components/Video/Controls/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '~/components/Video/Controls/ToggleVideoButton/ToggleVideoButton';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {},
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
  const { isFetching } = useAppState();
  const { isAcquiringLocalTracks, isConnecting, getAudioAndVideoTracks } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;

  useEffect(() => {
    if (!mediaError) {
      getAudioAndVideoTracks().catch((error) => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, mediaError]);

  return (
    <>
      <Card className={clsx(classes.card, className)}>
        <LocalVideoPreview />
        {actionBar}
      </Card>

      <MediaErrorSnackbar error={mediaError} />
    </>
  );
}
