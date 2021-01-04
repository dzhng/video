import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Drawer } from '@material-ui/core';

import { LocalModel, Call, Template } from '~/firebase/schema-types';
import { useAppState } from '~/state';
import { VideoProvider } from '~/components/Video/VideoProvider';
import { CallProvider } from '~/components/CallProvider';
import useConnectionOptions from '~/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import TemplateTitle from '~/components/EditableTemplateTitle/EditableTemplateTitle';
import ActivitiesBar from '~/components/Activities/ActivitiesBar/ActivitiesBar';
import CallFlow from './CallFlow';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      width: '100%',
    },
    drawerPaper: theme.customMixins.activitiesBar,
    activitiesSpacer: theme.customMixins.activitiesBar,
    content: {
      flexGrow: 1,
      height: '100vh',
    },
  }),
);

export default function CallContainer({
  template,
  isHost,
  call,
  createCall,
  endCall,
}: {
  template: LocalModel<Template>;
  isHost: boolean;
  call?: LocalModel<Call>;
  createCall(): Promise<boolean>;
  endCall(): void;
}) {
  const classes = useStyles();
  const router = useRouter();
  const { setError } = useAppState();
  const connectionOptions = useConnectionOptions();

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
    router.push('/finish');
  }, [router]);

  const handleEndCall = useCallback(() => {
    endCall();
    router.push('/finish?hostEnded=true');
  }, [endCall, router]);

  // call has ended when the call has been set but template's ongoingCall property doesn't match current call (either null or moved on to another call)
  const isCallEnded: boolean = Boolean(currentCall && currentCall !== template.ongoingCallId);

  useEffect(() => {
    if (isCallEnded) {
      router.push('/finish?hostEnded=true');
    }
  }, [isCallEnded, router]);

  return (
    <UnsupportedBrowserWarning>
      <div className={classes.container}>
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <TemplateTitle template={template} showBackButton={!!fromHref} backHref={fromHref} />
          <ActivitiesBar template={template} />
        </Drawer>
        <div className={classes.activitiesSpacer} />

        <div className={classes.content}>
          <VideoProvider
            options={connectionOptions}
            onError={setError}
            onDisconnect={handleDisconnect}
          >
            <CallProvider
              call={call?.id === currentCall ? call : undefined}
              template={template}
              isHost={isHost}
              endCall={handleEndCall}
            >
              <CallFlow isCallStarted={!!currentCall} createCall={createCall} />
            </CallProvider>
          </VideoProvider>
        </div>
      </div>
    </UnsupportedBrowserWarning>
  );
}
