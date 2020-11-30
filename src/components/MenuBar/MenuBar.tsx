import React from 'react';
import { useRouter } from 'next/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Typography, AppBar, Toolbar } from '@material-ui/core';

import { useAppState } from '~/state';
import useRoomState from '~/hooks/Call/useRoomState/useRoomState';
import ToggleFullscreenButton from '~/components/Call/ToggleFullScreenButton/ToggleFullScreenButton';
import FlipCameraButton from '~/components/Call/FlipCameraButton/FlipCameraButton';
import LocalAudioLevelIndicator from '~/components/Call/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import Menu from './Menu/Menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    toolbar: {
      [theme.breakpoints.down('xs')]: {
        padding: 0,
      },
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    displayName: {
      margin: '1.1em 0.6em',
      minWidth: '200px',
      fontWeight: 600,
    },
  }),
);

export default function MenuBar() {
  const classes = useStyles();
  const roomState = useRoomState();
  const router = useRouter();
  const { user } = useAppState();

  const { slug } = router.query;
  const roomName: string = String(slug);

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar className={classes.toolbar}>
        {roomState === 'disconnected' ? (
          <Typography className={classes.displayName} variant="body1">
            {user?.displayName}
          </Typography>
        ) : (
          <h3>{roomName}</h3>
        )}
        <div className={classes.rightButtonContainer}>
          <FlipCameraButton />
          <LocalAudioLevelIndicator />
          <ToggleFullscreenButton />
          <Menu />
        </div>
      </Toolbar>
    </AppBar>
  );
}
