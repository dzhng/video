import React, { useState, useRef, useCallback } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Popper, Fade, Card, Typography } from '@material-ui/core';
import clsx from 'clsx';

import { isMobile } from '~/utils';
import useRoomState from '~/hooks/Video/useRoomState/useRoomState';
import { useAppState } from '~/state';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';

import EndCallButton from './EndCallButton/EndCallButton';
import ToggleAudioButton from './ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from './ToggleVideoButton/ToggleVideoButton';
import ToggleScreenShareButton from './ToggleScreenShareButton/ToggleScreenShareButton';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: 'flex',
      width: 'min-content',
      zIndex: 1,
      transition: 'opacity 1.2s, transform 1.2s, visibility 0s 1.2s',
      opacity: 0,
      visibility: 'hidden',

      '&.showControls, &:hover': {
        transition: 'opacity 0.6s, transform 0.6s, visibility 0s',
        opacity: 1,
        visibility: 'visible',
      },
    },
    popper: {
      padding: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
      color: 'white',
      boxShadow: theme.shadows[7],
    },
  }),
);

export default function Controls({ showControls = true }: { showControls?: boolean }) {
  const classes = useStyles();
  const roomState = useRoomState();
  const { isFetching } = useAppState();
  const { isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const popperAnchor = useRef<HTMLDivElement>(null);
  const popperTimer = useRef<any>();
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [popperMessage, _setPopperMessage] = useState<React.ReactNode>(null);

  // auto close var will automatically open and close popper after set time
  const setPopperMessage = useCallback((node: React.ReactNode, autoClose?: boolean) => {
    _setPopperMessage(node);
    if (autoClose) {
      setIsPopperOpen(true);

      if (popperTimer.current) {
        clearTimeout(popperTimer.current);
        popperTimer.current = undefined;
      }
      popperTimer.current = setTimeout(() => setIsPopperOpen(false), 1500);
    }
  }, []);

  const isReconnecting = roomState === 'reconnecting';
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting || isReconnecting;

  return (
    <>
      <div
        data-testid="container"
        ref={popperAnchor}
        className={clsx(classes.container, { showControls })}
      >
        <ToggleAudioButton
          disabled={disableButtons}
          setPopperOpen={setIsPopperOpen}
          setPopperMessage={setPopperMessage}
        />
        <ToggleVideoButton disabled={disableButtons} setPopperMessage={setPopperMessage} />
        {roomState !== 'disconnected' && !isMobile && <ToggleScreenShareButton />}
        {roomState !== 'disconnected' && <EndCallButton setPopperMessage={setPopperMessage} />}
      </div>

      <Popper open={isPopperOpen} anchorEl={popperAnchor.current} placement="top" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card className={classes.popper}>
              <Typography variant="body1">{popperMessage}</Typography>
            </Card>
          </Fade>
        )}
      </Popper>
    </>
  );
}
