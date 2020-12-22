import React, { useState, useEffect, useRef } from 'react';

import firebase, { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import Home from '~/containers/Home/Home';
import { useAppState } from '~/state';
import { Collections, LocalModel, Template } from '~/firebase/schema-types';

const snapshotToCall = (
  snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>,
) => {
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as LocalModel<Template>),
  );
};

export default withPrivateRoute(function IndexPage() {
  const { currentWorkspaceId } = useAppState();
  const [templates, setTemplates] = useState<LocalModel<Template>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // track of prevous firebase subscriptions to unsubscribe when currentWorkspaceId change
  let previousUnsubscribe = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsLoading(true);
    if (!currentWorkspaceId) {
      return;
    }

    if (previousUnsubscribe.current) {
      previousUnsubscribe.current();
    }

    previousUnsubscribe.current = db
      .collection(Collections.CALLS)
      .where('workspaceId', '==', currentWorkspaceId)
      .onSnapshot(function (querySnapshot) {
        const docs = snapshotToCall(querySnapshot);
        setTemplates(docs);
        setIsLoading(false);
      });

    return previousUnsubscribe.current;
  }, [currentWorkspaceId]);

  return <Home templates={templates} isLoading={isLoading} />;
});
