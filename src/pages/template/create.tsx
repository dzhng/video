import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

import firebase, { db } from '~/utils/firebase';
import { Collections, Template } from '~/firebase/schema-types';
import { useAppState } from '~/state';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import CreateContainer from '~/containers/CreateTemplate/CreateTemplate';

export default withPrivateRoute(function CreateCallPage() {
  const router = useRouter();
  const { user, markIsWriting, currentWorkspaceId } = useAppState();

  const create = useCallback(
    async (values) => {
      if (!user || !currentWorkspaceId) {
        // do nothing if user doesn't exist
        console.warn('Trying to create template without signed in user');
        return;
      }

      // before adding, replace timestamp with server helper
      const data: Template = {
        name: values.name,
        workspaceId: currentWorkspaceId,
        creatorId: user.uid,
        activities: [],
        isDeleted: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      markIsWriting();
      const record = await db.collection(Collections.TEMPLATES).add(data);

      // navigate to new tempalate page to set it up
      router.push(`/template/${record.id}`);
    },
    [router, user, currentWorkspaceId, markIsWriting],
  );

  return <CreateContainer save={create} />;
});
