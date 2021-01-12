import React from 'react';
import clsx from 'clsx';
import useDimensions from 'react-cool-dimensions';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import LocalVideoPreview from '~/components/Video/LocalVideoPreview/LocalVideoPreview';
import Controls from '~/components/Video/Controls/Controls';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '80vh',
      boxShadow: theme.shadows[15],
    },
    videoContainer: {
      overflow: 'hidden',
      backgroundColor: 'black',
    },
    controlsContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(1),
      flexShrink: 0,
    },
  }),
);

export default function LocalPreviewCard({
  className,
  actionBar,
}: {
  className?: string;
  actionBar?: React.ReactNode;
}) {
  const classes = useStyles();

  // measure the width of Card to ensure video is square
  const { ref, width } = useDimensions<HTMLDivElement>();

  return (
    <>
      <Card ref={ref} className={clsx(classes.card, className)}>
        <div className={classes.videoContainer} style={{ height: width }}>
          <LocalVideoPreview />
        </div>
        <div className={classes.controlsContainer}>
          <Controls />
        </div>
        {actionBar}
      </Card>
    </>
  );
}
