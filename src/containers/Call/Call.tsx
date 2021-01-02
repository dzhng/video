import React, { useState, useEffect, useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Drawer } from '@material-ui/core';

import { LocalModel, Call, Template } from '~/firebase/schema-types';
import { useAppState } from '~/state';
import { VideoProvider } from '~/components/Video/VideoProvider';
import useConnectionOptions from '~/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import TemplateTitle from '~/components/EditableTemplateTitle/EditableTemplateTitle';
import ActivitiesBar from '~/components/ActivitiesBar/ActivitiesBar';
import CallFlow from './CallFlow';
import FinishCall from './FinishCall';

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
  const { setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  // tracks if user has started the call, so we can show finish screen when call ends instead of lobby again
  const [currentCall, setCurrentCall] = useState<string | null>(template.ongoingCallId ?? null);

  // tracks if the user has explicitly left the call
  const [didLeave, setDidLeave] = useState(false);

  useEffect(() => {
    if (template.ongoingCallId && currentCall === null) {
      setCurrentCall(template.ongoingCallId);
    }
  }, [template.ongoingCallId, currentCall]);

  const handleDisconnect = useCallback(() => {
    setDidLeave(true);
  }, []);

  // call has ended when the call has been set but template's ongoingCall property doesn't match current call (either null or moved on to another call)
  const isCallEnded = currentCall && currentCall !== template.ongoingCallId;
  const isCallFinished = isCallEnded || didLeave;

  return (
    <>
      {!isCallFinished && (
        <UnsupportedBrowserWarning>
          <div className={classes.container}>
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              <TemplateTitle template={template} />
              <ActivitiesBar template={template} />
            </Drawer>
            <div className={classes.activitiesSpacer} />

            <div className={classes.content}>
              <VideoProvider
                options={connectionOptions}
                onError={setError}
                onDisconnect={handleDisconnect}
              >
                <CallFlow
                  isCallStarted={!!currentCall}
                  isHost={isHost}
                  call={call?.id === currentCall ? call : undefined}
                  createCall={createCall}
                />
              </VideoProvider>
            </div>
          </div>
        </UnsupportedBrowserWarning>
      )}

      {isCallFinished && <FinishCall didLeave={didLeave} />}
    </>
  );
}
