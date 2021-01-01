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
import Lobby from './Lobby';
import CreateCall from './CreateCall';
import WaitForHost from './WaitForHost';
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
  const [callHasStarted, setCallHasStarted] = useState(false);

  // tracks if the call was created by user or if just joining existing call
  const [callCreated, setCallCreated] = useState(false);

  // a call is defined to be started if the template has ongoing call id
  const isCallOngoing = template.ongoingCallId;
  const isCallFinished = callHasStarted && !isCallOngoing;

  useEffect(() => {
    if (isCallOngoing) {
      setCallHasStarted(true);
    }
  }, [isCallOngoing]);

  const handleCreate = useCallback(() => {
    setCallCreated(true);
    return createCall();
  }, [createCall]);

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
              <VideoProvider options={connectionOptions} onError={setError}>
                {isCallOngoing ? (
                  <Lobby waitForJoin={!callCreated} isHost={isHost} call={call} endCall={endCall} />
                ) : isHost ? (
                  <CreateCall create={handleCreate} />
                ) : (
                  <WaitForHost />
                )}
              </VideoProvider>
            </div>
          </div>
        </UnsupportedBrowserWarning>
      )}

      {isCallFinished && <FinishCall />}
    </>
  );
}
