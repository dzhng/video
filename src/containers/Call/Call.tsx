import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Drawer } from '@material-ui/core';

import { LocalModel, Call, Template } from '~/firebase/schema-types';
import { useAppState } from '~/state';
import { VideoProvider } from '~/components/Video/VideoProvider';
import useConnectionOptions from '~/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import ActivitiesBar from '~/components/ActivitiesBar/ActivitiesBar';
import Lobby from './Lobby';
import CreateCall from './CreateCall';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      width: '100%',
    },
    drawerPaper: theme.customMixins.activitiesBar,
    activitiesSpacer: theme.customMixins.activitiesBar,
  }),
);

export default function CallContainer({
  template,
  call,
  createCall,
  endCall,
}: {
  template: LocalModel<Template>;
  call?: LocalModel<Call>;
  createCall(): Promise<boolean>;
  endCall(): void;
}) {
  const classes = useStyles();
  const { setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  // a call is defined to be started if the call model exist and template has ongoing call id
  const isCallStarted = call && template.ongoingCallId;

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
          <ToolbarContent template={template} />
          <ActivitiesBar template={template} />
        </Drawer>
        <div className={classes.activitiesSpacer} />

        <VideoProvider options={connectionOptions} onError={setError}>
          {isCallStarted ? (
            <Lobby call={call!} endCall={endCall} />
          ) : (
            <CreateCall create={createCall} />
          )}
        </VideoProvider>
      </div>
    </UnsupportedBrowserWarning>
  );
}
