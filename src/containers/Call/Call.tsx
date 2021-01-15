import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Drawer, Hidden } from '@material-ui/core';

import { isBrowser } from '~/utils';
import { useAppState } from '~/state';
import { VideoProvider } from '~/components/Video/VideoProvider';
import useConnectionOptions from '~/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import TemplateTitle from '~/components/EditableTemplateTitle/EditableTemplateTitle';
import ActivitiesBar from '~/components/Activities/ActivitiesBar/ActivitiesBar';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import CallFlow from './CallFlow';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      width: '100%',

      background: 'linear-gradient(-45deg, #704c16, #742040, #115168, #167b72)',
      backgroundSize: '400% 400%',
      // steps(300) is important here since it tells browser to run at 10fps
      // this is important for reducing cpu usage
      animation: 'gradient 30s steps(300) infinite',
      // do animation on gpu so its less taxing on cpu
      transform: 'translateZ(0)',
    },
    drawerPaper: theme.customMixins.activitiesBarMini,
    transparentBackground: {
      backgroundColor: 'rgba(255,255,255,0.75)',
    },
    activitiesSpacer: theme.customMixins.activitiesBarMini,
    content: {
      flexGrow: 1,
      height: '100vh',
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
  const {
    template,
    isHost,
    currentActivity,
    startActivity,
    isActivityDrawerOpen,
    setIsActivityDrawerOpen,
  } = useCallContext();

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
      /*window.location.assign(
        `${window.location.protocol}//${window.location.host}/finish?fromHref=${encodeURIComponent(
          fromHref ?? '',
        )}`,
        );*/
      router.replace(`/finish?fromHref=${encodeURIComponent(fromHref ?? '')}`);
    }
  }, [isCallEnded, fromHref, router]);

  useEffect(() => {
    if (isCallEnded) {
      /*window.location.assign(
        `${window.location.protocol}//${
          window.location.host
        }/finish?hostEnded=true&fromHref=${encodeURIComponent(fromHref ?? '')}`,
        );*/
      router.replace(`/finish?hostEnded=true&fromHref=${encodeURIComponent(fromHref ?? '')}`);
    }
  }, [isCallEnded, fromHref, router]);

  const isCallStarted: boolean = !!currentCall;
  const container = isBrowser ? () => window.document.body : undefined;

  const drawer = (
    <>
      <TemplateTitle
        template={template}
        showBackButton={!!fromHref && !isCallStarted}
        backHref={fromHref}
        disabled={!isHost}
      />
      <ActivitiesBar
        template={template}
        mode={isHost ? (isCallStarted ? 'call' : 'edit') : 'view'}
        currentActivity={currentActivity}
        startActivity={startActivity}
      />
    </>
  );

  return (
    <UnsupportedBrowserWarning>
      <div className={classes.container}>
        <Hidden smUp implementation="js">
          <Drawer
            container={container}
            variant="temporary"
            anchor="left"
            open={isActivityDrawerOpen}
            onClose={() => setIsActivityDrawerOpen(false)}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="js">
          <Drawer
            classes={{
              paper: clsx(classes.drawerPaper, classes.transparentBackground),
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
          <div className={classes.activitiesSpacer} />
        </Hidden>

        <div className={classes.content}>
          <VideoProvider
            options={connectionOptions}
            onError={setError}
            onDisconnect={handleDisconnect}
          >
            <CallFlow isCallStarted={isCallStarted} />
          </VideoProvider>
        </div>
      </div>
    </UnsupportedBrowserWarning>
  );
}
