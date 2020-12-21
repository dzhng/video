import { useEffect, useState } from 'react';
import firebase, { db } from '~/utils/firebase';
import { Collections, User, Workspace } from '~/firebase/schema-types';
import useFirebaseAuth from '../useFirebaseAuth/useFirebaseAuth';

export default function useWorkspaces() {
  const { user, isAuthReady } = useFirebaseAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [userRecord, setUserRecord] = useState<User | null>(null);
  const [isWorkspacesReady, setIsWorkspacesReady] = useState(false);

  useEffect(() => {
    const queryWorkspaces = async (uid: string) => {
      // if user ever changes, make sure to unset readiness
      setIsWorkspacesReady(false);

      const userDoc = await db.collection(Collections.USERS).doc(uid).get();
      const _userRecord = userDoc.data() as User;
      if (!_userRecord) {
        console.error('User record does not exist!');
        return;
      }

      setUserRecord(_userRecord);

      const workspaceDocs = await db
        .collection(Collections.WORKSPACES)
        .where(firebase.firestore.FieldPath.documentId(), 'in', _userRecord.workspaceIds)
        .get();
      const records = workspaceDocs.docs.map((doc) => doc.data() as Workspace);
      setWorkspaces(records);
      setIsWorkspacesReady(true);
    };

    if (isAuthReady && user) {
      queryWorkspaces(user.uid);
    }
  }, [isAuthReady, user]);

  return { userRecord, workspaces, isWorkspacesReady };
}
