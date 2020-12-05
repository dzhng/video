import React, { useState, useEffect } from 'react';

import { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import Home from '~/containers/Home/Home';
import { useAppState } from '~/state';
import { Call } from '~/firebase/schema-types';

export default withPrivateRoute(function IndexPage() {
  const { user } = useAppState();
  const [upcomingCalls, setUpcomingCalls] = useState<Call[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    db.collection('calls')
      .where('users', 'array-contains', user.uid)
      .onSnapshot(function (querySnapshot) {
        const calls = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUpcomingCalls(calls as Call[]);
      });
  }, [user]);

  return <Home calls={upcomingCalls} />;
});
