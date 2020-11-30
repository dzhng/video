import React, { useState, useEffect } from 'react';

import { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import Home from '~/containers/Home/Home';
import useFirebaseAuth from '~/state/useFirebaseAuth/useFirebaseAuth';
import { Call } from '~/firebase/schema-types';

export default withPrivateRoute(function IndexPage() {
  const { user } = useFirebaseAuth();
  const [upcomingCalls, setUpcomingCalls] = useState<Call[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    db.collection('calls')
      .where('participants', 'array-contains', user.uid)
      .onSnapshot(function (querySnapshot) {
        const calls = querySnapshot.docs.map((doc) => doc.data());
        setUpcomingCalls(calls as Call[]);
      });
  }, [user]);

  return <Home calls={upcomingCalls} />;
});
