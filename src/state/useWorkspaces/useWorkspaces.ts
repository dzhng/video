import { useEffect, useState, useCallback } from 'react';
import firebase, { db } from '~/utils/firebase';
import { Collections, User, Workspace, LocalModel } from '~/firebase/schema-types';
import useFirebaseAuth from '../useFirebaseAuth/useFirebaseAuth';

export default function useWorkspaces() {
  const { user, isAuthReady } = useFirebaseAuth();
  const [workspaces, setWorkspaces] = useState<LocalModel<Workspace>[]>([]);
  const [userRecord, setUserRecord] = useState<User | null>(null);
  const [workspaceIds, setWorkspaceIds] = useState<string[]>([]);
  const [isWorkspacesReady, setIsWorkspacesReady] = useState(false);

  useEffect(() => {
    if (!(isAuthReady && user)) {
      return;
    }

    const unsubscribe = db
      .collection(Collections.USERS)
      .doc(user.uid)
      .onSnapshot((snapshot) => {
        const data = snapshot.data() as User;
        setUserRecord(data);
      });

    return unsubscribe;
  }, [isAuthReady, user]);

  useEffect(() => {
    if (!(isAuthReady && user)) {
      return;
    }

    const unsubscribe = db
      .collectionGroup(Collections.MEMBERS)
      .where('memberId', '==', user.uid)
      .onSnapshot((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.ref.parent.parent!.id);
        setWorkspaceIds(ids);
      });

    return unsubscribe;
  }, [isAuthReady, user]);

  useEffect(() => {
    const queryWorkspaces = async () => {
      if (workspaceIds.length <= 0) {
        setWorkspaces([]);
        return;
      }

      setIsWorkspacesReady(false);

      const workspaceDocs = await db
        .collection(Collections.WORKSPACES)
        .where(firebase.firestore.FieldPath.documentId(), 'in', workspaceIds)
        .get();
      const records = workspaceDocs.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as LocalModel<Workspace>),
      );

      setWorkspaces(records);
      setIsWorkspacesReady(true);
    };

    queryWorkspaces();
  }, [workspaceIds]);

  const setCurrentWorkspaceId = useCallback(
    (workspaceId: string | null) => {
      if (user) {
        db.collection(Collections.USERS).doc(user.uid).update({
          defaultWorkspaceId: workspaceId,
        });
      }
    },
    [user],
  );

  const createWorkspace = useCallback(
    async (name: string): Promise<LocalModel<Workspace> | null> => {
      if (!user) {
        return null;
      }

      setIsWorkspacesReady(false);
      const batch = db.batch();

      const newWorkspaceRef = db.collection(Collections.WORKSPACES).doc();
      batch.set(newWorkspaceRef, {
        name,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // set the new workspace as the new default
      const userRef = db.collection(Collections.USERS).doc(user.uid);
      batch.update(userRef, {
        defaultWorkspaceId: newWorkspaceRef.id,
      });

      const memberRef = newWorkspaceRef.collection(Collections.MEMBERS).doc(user.uid);
      batch.set(memberRef, {
        role: 'owner',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      await batch.commit();
      setIsWorkspacesReady(true);

      return {
        id: newWorkspaceRef.id,
        name,
        createdAt: new Date(),
      } as LocalModel<Workspace>;
    },
    [user],
  );

  // always make sure current workspace id exist in actual workspace list first (might take time since workspace list can be delayed due to querying
  const currentWorkspaceId = workspaces
    .map((doc) => doc.id)
    .includes(userRecord?.defaultWorkspaceId ?? '')
    ? userRecord?.defaultWorkspaceId
    : workspaceIds[0];

  return {
    userRecord,
    workspaces,
    isWorkspacesReady,
    currentWorkspaceId,
    setCurrentWorkspaceId,
    createWorkspace,
  };
}
