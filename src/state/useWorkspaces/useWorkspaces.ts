import { useEffect, useState, useCallback } from 'react';
import firebase, { db } from '~/utils/firebase';
import { Collections, User, Workspace, LocalModel } from '~/firebase/schema-types';
import useFirebaseAuth from '../useFirebaseAuth/useFirebaseAuth';

export default function useWorkspaces() {
  const { user, isAuthReady } = useFirebaseAuth();
  const [workspaces, setWorkspaces] = useState<LocalModel<Workspace>[]>([]);
  const [userRecord, setUserRecord] = useState<User | null>(null);
  const [isWorkspacesReady, setIsWorkspacesReady] = useState(false);
  const [currentWorkspaceId, _setCurrentWorkspaceId] = useState<string | null>(null);

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

  useEffect(() => {}, [isAuthReady, user]);

  useEffect(() => {
    const queryWorkspaces = async (uid: string) => {
      // if user ever changes, make sure to unset readiness
      setIsWorkspacesReady(false);

      const userDoc = await db.collection(Collections.USERS).doc(uid).get();
      const _userRecord = userDoc.data() as User;
      if (!_userRecord) {
        // regularly ping the server until the records are successfully created (should be done by cloud function)
        console.warn('User record does not exist!');
        setTimeout(() => queryWorkspaces(uid), 1000);
        return;
      }

      setUserRecord(_userRecord);

      const workspaceDocs = await db
        .collection(Collections.WORKSPACES)
        .where(firebase.firestore.FieldPath.documentId(), 'in', _userRecord.workspaceIds)
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

    if (isAuthReady && user) {
      queryWorkspaces(user.uid);
    }
  }, [isAuthReady, user]);

  useEffect(() => {
    if (userRecord) {
      const defaultIsValid = userRecord.workspaceIds.includes(userRecord.defaultWorkspaceId ?? '');

      const workspaceId = defaultIsValid
        ? (userRecord.defaultWorkspaceId as string)
        : userRecord.workspaceIds[0];
      _setCurrentWorkspaceId(workspaceId);
    }
  }, [userRecord]);

  const setCurrentWorkspaceId = useCallback(
    (workspaceId: string | null) => {
      _setCurrentWorkspaceId(workspaceId);

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

      const userRef = db.collection(Collections.USERS).doc(user.uid);
      batch.update(userRef, {
        defaultWorkspaceId: newWorkspaceRef.id,
        workspaceIds: firebase.firestore.FieldValue.arrayUnion(newWorkspaceRef.id),
      });

      const adminRef = newWorkspaceRef.collection(Collections.ADMINS).doc(user.uid);
      batch.set(adminRef, {
        role: 'owner',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      await batch.commit();
      _setCurrentWorkspaceId(newWorkspaceRef.id);
      setIsWorkspacesReady(true);

      return {
        id: newWorkspaceRef.id,
        name,
        createdAt: new Date(),
      } as LocalModel<Workspace>;
    },
    [user],
  );

  return {
    userRecord,
    workspaces,
    isWorkspacesReady,
    currentWorkspaceId,
    setCurrentWorkspaceId,
    createWorkspace,
  };
}
