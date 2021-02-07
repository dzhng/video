import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Card, Typography, Button, CircularProgress } from '@material-ui/core';
import useDimensions from 'react-cool-dimensions';
import { VideoCallFilledIcon } from '~/components/Icons';
import LocalVideoPreview from '~/components/Video/LocalVideoPreview/LocalVideoPreview';
import Controls from '~/components/Video/Controls/Controls';
import SettingsSpeedDial from '~/components/Video/SettingsSpeedDial/SettingsSpeedDial';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
      maxHeight: '60vh',
      boxShadow: theme.shadows[15],
      // fix safari video cropping bug
      transform: 'translateZ(0)',

      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        textAlign: 'center',
      },
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        height: ({ width }: { width: number }) => width * 0.67,
      },
      '& >div:first-child': {
        flexBasis: '300px',
        flexGrow: 2,
      },
      '& >div:nth-child(2)': {
        flexBasis: '150px',
        flexGrow: 1,
        borderLeft: theme.dividerBorder,
      },
    },
    videoContainer: {
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'black',
    },
    controlsContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      margin: theme.spacing(1),
      height: theme.callControlHeight,

      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexShrink: 0,
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(2),
      backgroundColor: theme.palette.grey[200],

      '& p,h1': {
        marginBottom: theme.spacing(2),
      },
    },
    actionButton: {
      ...theme.customMixins.callButton,
      height: 43,
      fontWeight: 'bold',
      fontSize: '1.1rem',
      flexShrink: 0,

      [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
      },
      '& div[role=progressbar]': {
        marginRight: theme.spacing(1),
      },
    },
  }),
);

export interface LocalPreviewCardProps {
  className?: string;
  title: string;
  actionText: string;
  helperText: string;
  disabled: boolean;
  isSubmitting: boolean;
  onSubmit(): void;
}

export default function LocalPreviewCard({
  className,
  title,
  helperText,
  actionText,
  disabled,
  isSubmitting,
  onSubmit,
}: LocalPreviewCardProps) {
  // set a height based on percentage of width so that video has a good display area
  // or else there'll be a weird transition state before the video starts where
  // the height will be super low
  const { ref, width } = useDimensions();
  const classes = useStyles({ width });

  return (
    <Card ref={ref} className={clsx(classes.card, className)}>
      <div className={classes.videoContainer}>
        <LocalVideoPreview />
        <div className={classes.controlsContainer}>
          <div className="left" style={{ width: 72, minHeight: 1, position: 'relative' }} />
          <Controls />
          <div className="right" style={{ width: 72, minHeight: 1, position: 'relative' }}>
            <SettingsSpeedDial />
          </div>
        </div>
      </div>

      <div className={classes.buttonContainer}>
        <Typography variant="h1">{title}</Typography>
        <Typography variant="body1">{helperText}</Typography>
        <Button
          color="primary"
          onClick={onSubmit}
          className={classes.actionButton}
          variant="contained"
          disabled={disabled}
        >
          {isSubmitting ? (
            <CircularProgress color="primary" size={'1rem'} />
          ) : (
            <>
              <VideoCallFilledIcon
                data-testid="start-join-call-button"
                style={{ marginRight: 8 }}
              />
              {actionText}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
