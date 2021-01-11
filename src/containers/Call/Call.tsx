import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Drawer, Hidden } from '@material-ui/core';

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
    },
    drawerPaper: theme.customMixins.activitiesBarMini,
    activitiesSpacer: theme.customMixins.activitiesBarMini,
    content: {
      flexGrow: 1,
      height: '100vh',
    },
  }),
);

export default function CallContainer() {
  const classes = useStyles();
  const router = useRouter();
  const { setError } = useAppState();
  const connectionOptions = useConnectionOptions();
  const { template, isHost, currentActivity, startActivity } = useCallContext();

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

  // make sure finish page is prefetched for fast loading
  useEffect(() => {
    router.prefetch('/finish');
  }, [router]);

  // call has ended when the call has been set but template's ongoingCall property doesn't match current call (either null or moved on to another call)
  const isCallEnded: boolean = Boolean(currentCall && currentCall !== template.ongoingCallId);

  const handleDisconnect = useCallback(() => {
    if (!isCallEnded) {
      router.push(`/finish?fromHref=${encodeURIComponent(fromHref ?? '')}`);
    }
  }, [isCallEnded, router, fromHref]);

  useEffect(() => {
    if (isCallEnded) {
      router.push(`/finish?hostEnded=true&fromHref=${encodeURIComponent(fromHref ?? '')}`);
    }
  }, [isCallEnded, router, fromHref]);

  const isCallStarted: boolean = !!currentCall;

  return (
    <UnsupportedBrowserWarning>
      <div className={classes.container}>
        <Hidden xsDown implementation="js">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
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
