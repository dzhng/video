import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { KeyboardOutlined as KeyboardIcon } from '@material-ui/icons';
import { useHotkeys } from 'react-hotkeys-hook';

import { isMobile } from '~/utils';
import { useAppState } from '~/state';
import { VideoProvider } from '~/components/Video/VideoProvider';
import useConnectionOptions from '~/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import HotkeyInstructions from './HotkeyInstructions/HotkeyInstructions';
import CallFlow from './CallFlow';
import ReactionIndicator from './ReactionIndicator/ReactionIndicator';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: '#091523',
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
  const { template } = useCallContext();

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
