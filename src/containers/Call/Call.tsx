import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Drawer, Fab, Hidden } from '@material-ui/core';

import { BackIcon } from '~/components/Icons';
import { isBrowser } from '~/utils';
import { useAppState } from '~/state';
import { VideoProvider } from '~/components/Video/VideoProvider';
import useConnectionOptions from '~/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import TemplateTitle from '~/components/EditableTemplateTitle/EditableTemplateTitle';
import ActivitiesBar from '~/components/Activities/ActivitiesBar/ActivitiesBar';
import Interactions from '~/components/Call/Interactions';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import CallFlow from './CallFlow';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      width: '100%',

      background: 'linear-gradient(-45deg, #704c16, #742040, #115168, #167b72)',
      backgroundSize: '400% 400%',
      // steps is important here since it tells browser to run at steps/seconds fps
      // this is important for reducing cpu usage
      animation: 'gradient 30s steps(150) infinite',
      // do animation on gpu so its less taxing on cpu
      transform: 'translateZ(0)',
    },
    drawerPaper: {
      ...theme.customMixins.activitiesBarMini,
      display: 'flex',
      flexDirection: 'column',
    },
    backButton: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    content: {
      flexGrow: 1,
      height: '100vh',
    },
    actionArea: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',

      // if only child, go 100% height
      '& >div:first-child:last-child': {
        maxHeight: '100%',
      },
      '& >div:first-child': {
        maxHeight: '50%',
      },
      '& >div:nth-child(2)': {
        flexBasis: '50%',
        flexGrow: 1,
      },
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

  const isCallStarted: boolean = !!currentCall;
  const container = isBrowser ? () => window.document.body : undefined;

  const drawer = (
    <>
      {!!fromHref && !isCallStarted && (
        <Link href={fromHref}>
          <Fab size="small" className={classes.backButton}>
            <BackIcon />
          </Fab>
        </Link>
      )}

      <div className={classes.actionArea}>
        <ActivitiesBar
          template={template}
          mode={isHost ? (isCallStarted ? 'call' : 'edit') : 'view'}
          currentActivity={currentActivity}
          startActivity={startActivity}
        />
        {isCallStarted && <Interactions />}
      </div>
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
          <div className={classes.drawerPaper}>{drawer}</div>
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
