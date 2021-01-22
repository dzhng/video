import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useHotkeys } from 'react-hotkeys-hook';

import { useAppState } from '~/state';
import { VideoProvider } from '~/components/Video/VideoProvider';
import useConnectionOptions from '~/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import HotkeyInstructions from './HotkeyInstructions/HotkeyInstructions';
import CallFlow from './CallFlow';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '100%',
      height: '100vh',

      background: 'linear-gradient(-45deg, #704c16, #742040, #115168, #167b72)',
      backgroundSize: '400% 400%',
      // steps is important here since it tells browser to run at steps/seconds fps
      // this is important for reducing cpu usage
      animation: 'gradient 30s steps(150) infinite',
      // do animation on gpu so its less taxing on cpu
      transform: 'translateZ(0)',
    },

    // define animation for container background
    '@global': {
      '@keyframes gradient': {
        '0%': {
          backgroundPosition: '0% 50%',
        },
        '50%': {
          backgroundPosition: '100% 50%',
        },
        '100%': {
          backgroundPosition: '0% 50%',
        },
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

  // call has ended when the call has been set but template's ongoingCall property doesn't match current call (either null or moved on to another call)
  const isCallEnded: boolean = Boolean(currentCall && currentCall !== template.ongoingCallId);

  const handleDisconnect = useCallback(() => {
    if (!isCallEnded) {
      window.location.assign(
        `${window.location.protocol}//${window.location.host}/finish?fromHref=${encodeURIComponent(
          fromHref ?? '',
        )}`,
      );
    }
  }, [isCallEnded, fromHref]);

  useEffect(() => {
    if (isCallEnded) {
      window.location.assign(
        `${window.location.protocol}//${
          window.location.host
        }/finish?hostEnded=true&fromHref=${encodeURIComponent(fromHref ?? '')}`,
      );
    }
  }, [isCallEnded, fromHref]);

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
        </div>
      </UnsupportedBrowserWarning>

      <HotkeyInstructions open={hotkeyPopperOpen} anchorRef={anchorRef} />
    </>
  );
}
