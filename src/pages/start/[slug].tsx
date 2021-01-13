import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Collections, LocalModel, Template } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import { useAppState } from '~/state';
import LoadingContainer from '~/containers/Loading/Loading';
import CallContainer from '~/containers/Call/Call';
import GuestSignIn from '~/containers/Call/GuestSignIn';
import { CallProvider } from '~/components/CallProvider';
import useIntercom from '~/hooks/useIntercom/useIntercom';

// start a call with given template id
// TODO: all these here can probably be put into hooks and exposed in CallProvider
export default function StartPage() {
  const router = useRouter();
  const { showLauncher } = useIntercom();
  const { isAuthReady, user } = useAppState();
  const [template, setTemplate] = useState<LocalModel<Template>>();
  // undefined means need to fetch
  const [isHost, setIsHost] = useState<boolean | undefined>(undefined);

  // make sure to hide launcher for this page, but reshow it when leaving the page
  useEffect(() => {
    showLauncher(false);
    return () => showLauncher(true);
  }, [showLauncher]);

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

  if (!isAuthReady) {
    return <LoadingContainer />;
  }

  if (!user) {
    return <GuestSignIn />;
  }

  // when both template and host status is ready, show call conatiner
  return template && isHost !== undefined ? (
    <>
      <Head>
        {/* On android, make browser UI dark in call mode */}
        <meta name="theme-color" content="#222" />
      </Head>

      <CallProvider template={template} isHost={isHost}>
        <CallContainer />
      </CallProvider>
    </>
  ) : (
    <LoadingContainer />
  );
}
