import React from 'react';
import clsx from 'clsx';
import useDimensions from 'react-cool-dimensions';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import LocalVideoPreview from '~/components/Video/LocalVideoPreview/LocalVideoPreview';
import Controls from '~/components/Video/Controls/Controls';
import SettingsSpeedDial from '~/components/Video/SettingsSpeedDial/SettingsSpeedDial';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '60vh',
      boxShadow: theme.shadows[15],
      // fix safari video cropping bug
      transform: 'translateZ(0)',
    },
    videoContainer: {
      overflow: 'hidden',
      backgroundColor: 'black',
    },
    controlsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      flexShrink: 0,

      '& .rightSpeedDial': {
        position: 'absolute',
        bottom: theme.spacing(1),
        right: theme.spacing(1),
      },
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
          <div className="left" style={{ width: 72, height: 72, position: 'relative' }} />
          <Controls />
          <div className="right" style={{ width: 72, height: 72, position: 'relative' }}>
            <SettingsSpeedDial className="rightSpeedDial" />
          </div>
        </div>
        {actionBar}
      </Card>
    </>
  );
}
