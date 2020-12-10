import React, { useState, useEffect } from 'react';

import firebase, { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import Home from '~/containers/Home/Home';
import { useAppState } from '~/state';
import { LocalModel, Call } from '~/firebase/schema-types';

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

export default withPrivateRoute(function IndexPage() {
  const { user } = useAppState();
  const [upcomingCalls, setUpcomingCalls] = useState<LocalModel<Call>[]>([]);
  const [pastCalls, setPastCalls] = useState<LocalModel<Call>[]>([]);
  const [ongoingCalls, setOngoingCalls] = useState<LocalModel<Call>[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    db.collection('calls')
      .where('users', 'array-contains', user.uid)
      .where('state', '==', 'pre')
      .onSnapshot(function (querySnapshot) {
        const calls = snapshotToCall(querySnapshot);
        setUpcomingCalls(calls);
      });

    db.collection('calls')
      .where('users', 'array-contains', user.uid)
      .where('state', '==', 'finished')
      .onSnapshot(function (querySnapshot) {
        const calls = snapshotToCall(querySnapshot);
        setPastCalls(calls);
      });

    db.collection('calls')
      .where('users', 'array-contains', user.uid)
      .where('state', '==', 'started')
      .onSnapshot(function (querySnapshot) {
        const calls = snapshotToCall(querySnapshot);
        setOngoingCalls(calls);
      });
  }, [user]);

  return <Home upcomingCalls={upcomingCalls} pastCalls={pastCalls} ongoingCalls={ongoingCalls} />;
});
