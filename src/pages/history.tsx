import React, { useState, useEffect } from 'react';
import firebase, { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import { useAppState } from '~/state';
import { Collections, LocalModel, Call } from '~/firebase/schema-types';
import HistoryContainer from '~/containers/History/History';

const snapshotToCall = (
  snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>,
) => {
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as LocalModel<Call>),
  );
};

// TODO: paginate calls list
export default withPrivateRoute(function IndexPage() {
  const { currentWorkspaceId } = useAppState();
  const [calls, setCalls] = useState<LocalModel<Call>[]>([]);
  const [isLoadingCalls, setIsLoadingCalls] = useState(true);

  useEffect(() => {
    setIsLoadingCalls(true);
    if (!currentWorkspaceId) {
      return;
    }

    const unsubscribe = db
      .collection(Collections.CALLS)
      .where('workspaceId', '==', currentWorkspaceId)
      .where('isFinished', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .onSnapshot(function (querySnapshot) {
        const docs = snapshotToCall(querySnapshot);
        setCalls(docs);
        setIsLoadingCalls(false);
      });

    return unsubscribe;
  }, [currentWorkspaceId]);

  return <HistoryContainer calls={calls} isLoadingCalls={isLoadingCalls} />;
});
