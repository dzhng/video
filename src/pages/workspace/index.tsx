import React, { useState, useEffect } from 'react';

import firebase, { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import Home from '~/containers/Home/Home';
import { useAppState } from '~/state';
import { LocalModel, Template } from '~/firebase/schema-types';

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
  const { user } = useAppState();
  const [templates, setTemplates] = useState<LocalModel<Template>[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    db.collection('calls')
      .where('templates', '==', user.uid)
      .onSnapshot(function (querySnapshot) {
        const docs = snapshotToCall(querySnapshot);
        setTemplates(docs);
      });
  }, [user]);

  return <Home templates={templates} />;
});
