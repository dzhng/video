import React, { useState, useEffect, useRef, useCallback } from 'react';

import firebase, { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import Home from '~/containers/Home/Home';
import { useAppState } from '~/state';
import { Collections, LocalModel, Template, Member, User, Invite } from '~/firebase/schema-types';

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
  const { user, currentWorkspaceId, setCurrentWorkspaceId, workspaces } = useAppState();
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

  const leaveWorkspace = useCallback(() => {
    if (!user || !currentWorkspaceId) {
      return;
    }

    // remove self by changing role to deleted
    db.collection(Collections.WORKSPACES)
      .doc(currentWorkspaceId)
      .collection(Collections.MEMBERS)
      .doc(user.uid)
      .update({
        role: 'deleted',
      });

    // set a new current workspace
    const newCurrentWorkspace = workspaces?.find((model) => model.id !== currentWorkspaceId);
    setCurrentWorkspaceId(newCurrentWorkspace?.id ?? null);
  }, [user, currentWorkspaceId, setCurrentWorkspaceId, workspaces]);

  const deleteWorkspace = useCallback(() => {
    if (!currentWorkspaceId) {
      return;
    }

    // once the workspace doc is deleted, a cloud function will mark all members as deleted as well
    db.collection(Collections.WORKSPACES).doc(currentWorkspaceId).update({
      isDeleted: true,
    });

    // set a new current workspace
    const newCurrentWorkspace = workspaces?.find((model) => model.id !== currentWorkspaceId);
    setCurrentWorkspaceId(newCurrentWorkspace?.id ?? null);
  }, [currentWorkspaceId, setCurrentWorkspaceId, workspaces]);

  const addMembers = useCallback(
    async (emails: string[]) => {
      if (!currentWorkspaceId) {
        return;
      }

      // creating an invite model will trigger cloud functions to do the rest
      const batch = db.batch();
      emails.forEach((email) => {
        const ref = db
          .collection(Collections.WORKSPACES)
          .doc(currentWorkspaceId)
          .collection(Collections.INVITES)
          .doc();

        const inviteData: Invite = {
          email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        batch.set(ref, inviteData);
      });

      await batch.commit();
    },
    [currentWorkspaceId],
  );

  const removeMembers = useCallback(
    async (ids: string[]) => {
      if (!currentWorkspaceId) {
        return;
      }

      const batch = db.batch();
      ids.forEach((id) => {
        const ref = db
          .collection(Collections.WORKSPACES)
          .doc(currentWorkspaceId)
          .collection(Collections.MEMBERS)
          .doc(id);

        batch.update(ref, {
          role: 'deleted',
        });
      });

      await batch.commit();
    },
    [currentWorkspaceId],
  );

  const currentWorkspace = workspaces?.find((model) => model.id === currentWorkspaceId);

  return (
    <Home
      isAdmin={isAdmin}
      workspace={currentWorkspace}
      members={members}
      isLoadingMembers={isLoadingMembers}
      templates={templates}
      isLoadingTemplates={isLoadingTemplates}
      leaveWorkspace={leaveWorkspace}
      deleteWorkspace={deleteWorkspace}
      addMembers={addMembers}
      removeMembers={removeMembers}
    />
  );
});
