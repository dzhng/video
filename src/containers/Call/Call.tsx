import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { KeyboardOutlined as KeyboardIcon } from '@material-ui/icons';
import { useHotkeys } from 'react-hotkeys-hook';

import { isMobile } from '~/utils';
import { useAppState } from '~/state';
import { ReactionType } from '~/firebase/rtdb-types';
import { VideoProvider } from '~/components/Video/VideoProvider';
import { CallEvents } from '~/components/CallProvider/events';
import useConnectionOptions from '~/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import HotkeyInstructions from './HotkeyInstructions/HotkeyInstructions';
import CallFlow from './CallFlow';
import ReactionIndicator from './ReactionIndicator/ReactionIndicator';

const reactionTimeMs = 1500;

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: '#091523',
      zIndex: 0,
    },
    gradientBackground: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      pointerEvents: 'none',
      zIndex: -1,
      opacity: 0,
      background: 'linear-gradient(-45deg, #704c16, #742040, #115168, #167b72)',
    },
    hotkeyButton: {
      position: 'fixed',
      top: 5,
      right: 5,
      backgroundColor: theme.palette.grey[900],
      color: theme.palette.grey[200],
      width: 30,
      height: 30,
      padding: '5px',
      borderRadius: 15,
      cursor: 'pointer',

      // it's important that this component has a higher zIndex than popper background
      // or else the mouse out events will always be called whenever popper is shown
      zIndex: 300,

      '&:hover': {
        color: theme.palette.grey[500],
      },
      '& svg': {
        width: 20,
        height: 20,
      },
    },
  }),
);

export default function CallContainer() {
  const classes = useStyles();
  const router = useRouter();
  const { setError } = useAppState();
  const connectionOptions = useConnectionOptions();
  const { template, events } = useCallContext();

  // URL that the back buttom goes to - set by the `from` query param. If not exist don't show back button
  const fromHref: string | undefined =
    router.query.from && decodeURIComponent(router.query.from as string);

  // tracks if user has started the call, so we can show finish screen when call ends instead of lobby again
  const [currentCall, setCurrentCall] = useState<string | null>(template.ongoingCallId ?? null);

  useEffect(() => {
    if (template.ongoingCallId && currentCall === null) {
      setCurrentCall(template.ongoingCallId);
    }
  }, [template.ongoingCallId, currentCall]);

  const handleDisconnect = useCallback(() => {
    const href = `/summary/${currentCall}?fromHref=${encodeURIComponent(fromHref ?? '')}`;
    // use window.assign for mobile since webrtc might freeze if not hard refreshed (android device stop bug)
    isMobile
      ? window.location.assign(`${window.location.protocol}//${window.location.host}${href}`)
      : router.push(href);
  }, [currentCall, fromHref, router]);

  const [hotkeyPopperOpen, setHotkeyPopperOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  // disable el tabbing in this page since that might
  // conflict with other hotkeys
  // show hotkey helper when pressed
  useHotkeys('tab', (e) => {
    e.preventDefault();
  });
  useHotkeys(
    'tab',
    (e) => {
      e.preventDefault();
      setHotkeyPopperOpen(true);
    },
    { keydown: true },
  );
  useHotkeys(
    'tab',
    (e) => {
      e.preventDefault();
      setHotkeyPopperOpen(false);
    },
    { keyup: true },
  );

  const controls = useAnimation();
  const opacity = useMotionValue(0);
  useEffect(() => {
    const handleNewReaction = (reaction: ReactionType) => {
      if (reaction.type !== 'tear') {
        // if already animating, do a shorter intemediary animation
        if (opacity.isAnimating()) {
          controls.stop();
          controls.start({
            opacity: [opacity.get(), 1, 0],
            transition: { duration: reactionTimeMs / 2 / 1000 },
          });
        } else {
          controls.start({
            opacity: [0, 1, 1, 0],
            transition: { duration: reactionTimeMs / 1000 },
          });
        }
      }
    };

    events.on(CallEvents.NEW_REACTION, handleNewReaction);
    return () => {
      events.off(CallEvents.NEW_REACTION, handleNewReaction);
      controls.stop();
    };
  }, [events, controls]);

  const isCallStarted: boolean = !!currentCall;

  return (
    <>
      <UnsupportedBrowserWarning>
        <div ref={anchorRef} className={classes.container}>
          <VideoProvider
            options={connectionOptions}
            onError={setError}
            onDisconnect={handleDisconnect}
          >
            <CallFlow isCallStarted={isCallStarted} fromHref={fromHref} />
          </VideoProvider>

          <motion.div
            className={classes.gradientBackground}
            style={{ opacity }}
            animate={controls}
          />
          <ReactionIndicator />
        </div>
      </UnsupportedBrowserWarning>

      {!isMobile && (
        <div
          className={classes.hotkeyButton}
          onMouseEnter={() => setHotkeyPopperOpen(true)}
          onMouseLeave={() => setHotkeyPopperOpen(false)}
          onClick={() => setHotkeyPopperOpen((state) => !state)}
        >
          <KeyboardIcon />
        </div>
      )}

      <HotkeyInstructions
        open={hotkeyPopperOpen}
        anchorRef={anchorRef}
        onClick={() => setHotkeyPopperOpen(false)}
      />
    </>
  );
}
