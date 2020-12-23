import React, { useState, useEffect, useRef } from 'react';

import firebase, { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import Home from '~/containers/Home/Home';
import { useAppState } from '~/state';
import { Collections, LocalModel, Template, Member, User } from '~/firebase/schema-types';

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
  const { user, currentWorkspaceId, workspaces } = useAppState();
  const [templates, setTemplates] = useState<LocalModel<Template>[]>([]);
  const [members, setMembers] = useState<LocalModel<User>[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  // track of prevous firebase subscriptions to unsubscribe when currentWorkspaceId change
  let previousUnsubscribeTemplates = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsLoadingTemplates(true);
    if (!currentWorkspaceId) {
      return;
    }

    if (previousUnsubscribeTemplates.current) {
      previousUnsubscribeTemplates.current();
    }

    previousUnsubscribeTemplates.current = db
      .collection(Collections.CALLS)
      .where('workspaceId', '==', currentWorkspaceId)
      .onSnapshot(function (querySnapshot) {
        const docs = snapshotToCall(querySnapshot);
        setTemplates(docs);
        setIsLoadingTemplates(false);
      });

    return previousUnsubscribeTemplates.current;
  }, [currentWorkspaceId]);

  useEffect(() => {
    const loadMemberUsers = async (workspaceId: string) => {
      const memberRecords = await db
        .collection(Collections.WORKSPACES)
        .doc(workspaceId)
        .collection(Collections.MEMBERS)
        .get();

      const ids = memberRecords.docs.map((doc) => doc.id);
      // this case should not happen, but guard for it anyways to prevent firebase error
      if (ids.length <= 0) {
        setMembers([]);
        return;
      }

      // find own member record to check admin
      const myRecord = memberRecords.docs.find((doc) => doc.id === user?.uid);
      setIsAdmin(myRecord ? (myRecord.data() as Member).role === 'owner' : false);

      const userRecords = await db
        .collection(Collections.USERS)
        .where(firebase.firestore.FieldPath.documentId(), 'in', ids)
        .get();

      const users = userRecords.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as LocalModel<User>),
      );
      setMembers(users);
      setIsLoadingMembers(false);
    };

    setIsLoadingMembers(true);
    if (!currentWorkspaceId) {
      return;
    }

    loadMemberUsers(currentWorkspaceId);
  }, [currentWorkspaceId, user]);

  const currentWorkspace = workspaces?.find((model) => model.id === currentWorkspaceId);

  return (
    <Home
      isAdmin={isAdmin}
      workspace={currentWorkspace}
      members={members}
      isLoadingMembers={isLoadingMembers}
      templates={templates}
      isLoadingTemplates={isLoadingTemplates}
    />
  );
});
