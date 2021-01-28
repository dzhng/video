import React, { useState, useEffect } from 'react';
import { fill } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from '@material-ui/core';

import { Collections, LocalModel, Template } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import { useAppState } from '~/state';
import LoadingContainer from '~/containers/Loading/Loading';
import GuestSignIn from '~/containers/Call/GuestSignIn';
import { CallProvider } from '~/components/CallProvider';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import ActivityControl from '~/components/ActivityControl/ActivityControl';
import ChatNotification from '~/components/Video/Room/ChatNotification/ChatNotification';
import Layout from '~/components/Video/Layout/Layout';

// this component is just responsible for creating a call model for testing
// note that if a call exits createCall will just fail, but it is fine because
// as long as there's an ongoing call to work with we are on
function CallCreator() {
  const { call, createCall, endCall } = useCallContext();
  useEffect(() => {
    createCall();
  }, [createCall]);

  // clicking on restart call will end current call, effect will then create a new call
  return (
    <div style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '45vh' }}>
      {call && (
        <Button variant="contained" onClick={endCall}>
          Restart Call
        </Button>
      )}
    </div>
  );
}

export default function CallTest() {
  const router = useRouter();
  const { isAuthReady, user } = useAppState();
  const [template, setTemplate] = useState<LocalModel<Template>>();
  // undefined means need to fetch
  const [isHost, setIsHost] = useState<boolean | undefined>(undefined);

  const templateId = String(router.query.slug);

  // fetching template model
  useEffect(() => {
    if (!templateId) {
      return;
    }

    const unsubscribe = db
      .collection(Collections.TEMPLATES)
      .doc(templateId)
      .onSnapshot((result) => {
        setTemplate({
          id: result.id,
          ...(result.data() as Template),
        });
      });

    return unsubscribe;
  }, [templateId]);

  // setting isHost
  useEffect(() => {
    if (!template || !user) {
      setIsHost(undefined);
      return;
    }

    // if the user belongs to the workspace that the template is in, the user is a host
    const { workspaceId } = template;
    db.collection(Collections.WORKSPACES)
      .doc(workspaceId)
      .collection(Collections.MEMBERS)
      .doc(user.uid)
      .get()
      .then((result) => setIsHost(result.exists));
  }, [template, user]);

  const numItems = Number(router.query.numItems) || 5;

  // generate random data for now
  const items = fill(Array(numItems), 0).map((_, idx) => ({
    key: String(idx),
    node: <div style={{ width: '100%', height: '100%', backgroundColor: '#999' }} />,
  }));

  const variant = (router.query.variant as string | undefined) ?? 'grid';

  if (!isAuthReady) {
    return <LoadingContainer />;
  }

  if (!user) {
    return <GuestSignIn />;
  }

  // when both template and host status is ready, show call conatiner
  return (
    <>
      <Head>
        {/* On android, make browser UI dark in call mode */}
        <meta name="theme-color" content="#222" />
        {/* disable intercom via css - cannot use hook because this page can be
          hard loaded, and hard loading means showLauncher will be run before boot.
          Hiding via css also means we don't get weird effects where it blinks in/out.
        */}
        <style>
          {`#intercom-container, .intercom-lightweight-app, .intercom-app {
            display: none;
          }`}
        </style>
      </Head>

      {template && isHost !== undefined ? (
        <CallProvider template={template} isHost={isHost}>
          <div
            style={{
              backgroundColor: 'black',
              height: '100vh',
              display: 'flex',
              alignItems: 'stretch',
            }}
          >
            <Layout
              variant={variant as any}
              gridItems={items}
              sideItem={<ActivityControl />}
              mainItem={<CallCreator />}
              mainControls={<div></div>}
              sideControls={<div></div>}
            />
            <ChatNotification />
          </div>
        </CallProvider>
      ) : (
        <LoadingContainer />
      )}
    </>
  );
}
