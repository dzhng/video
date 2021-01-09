import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Collections, LocalModel, Template } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import { useAppState } from '~/state';
import LoadingContainer from '~/containers/Loading/Loading';
import CallContainer from '~/containers/Call/Call';
import { CallProvider } from '~/components/CallProvider';

// start a call with given template id
// TODO: all these here can probably be put into hooks and exposed in CallProvider
export default function StartPage() {
  const router = useRouter();
  const { user } = useAppState();
  const [template, setTemplate] = useState<LocalModel<Template>>();
  const [isHost, setIsHost] = useState<boolean | null>(null);

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
    if (!template) {
      return;
    }

    if (!user) {
      setIsHost(false);
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

  // when both template and host status is ready, show call conatiner
  return template && isHost !== null ? (
    <CallProvider template={template} isHost={isHost}>
      <CallContainer />
    </CallProvider>
  ) : (
    <LoadingContainer />
  );
}
