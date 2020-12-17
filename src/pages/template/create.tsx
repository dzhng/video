import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

import firebase, { db } from '~/utils/firebase';
import { Template } from '~/firebase/schema-types';
import { useAppState } from '~/state';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import EditContainer from '~/containers/EditTemplate/EditTemplate';

export default withPrivateRoute(function CreateCallPage() {
  const router = useRouter();
  const { user, markIsWriting } = useAppState();

  const create = useCallback(
    (template: Template) => {
      if (!user) {
        // do nothing if user doesn't exist
        console.warn('Trying to create template without signed in user');
        return;
      }

      // before adding, replace timestamp with server helper
      const data = {
        ...template,
        creatorId: [user.uid],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      console.log('Creating:', data);

      db.collection('templates').add(data);
      markIsWriting();
      router.push('/');
    },
    [router, user, markIsWriting],
  );

  return <EditContainer save={create} />;
});
