import { useState, useEffect, useCallback } from 'react';
import firebase, { db } from '~/utils/firebase';
import { Collections, LocalModel, Template, Call } from '~/firebase/schema-types';
import { useAppState } from '~/state';

export default function useCall(template: LocalModel<Template>) {
  const { user } = useAppState();
  const [ongoingCall, setOngoingCall] = useState<LocalModel<Call>>();

  // fetching call model
  useEffect(() => {
    if (!template || !template.ongoingCallId) {
      setOngoingCall(undefined);
      return;
    }

    const unsubscribe = db
      .collection(Collections.CALLS)
      .doc(template.ongoingCallId)
      .onSnapshot((result) => {
        setOngoingCall({
          id: result.id,
          ...(result.data() as Call),
        });
      });

    return unsubscribe;
  }, [template]);

  // create a new call if one does not exist
  const createCall = useCallback(async (): Promise<boolean> => {
    if (!user) {
      return false;
    }

    // create a new call ref locally so we can have the ID
    const newCallRef = db.collection(Collections.CALLS).doc();
    const templateRef = db.collection(Collections.TEMPLATES).doc(template.id);

    const newCallData: Call = {
      templateId: template.id,
      creatorId: user.uid,
      isFinished: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const success = await db.runTransaction<boolean>(async (transaction) => {
      const doc = await transaction.get(templateRef);
      if (!doc.exists) {
        return false;
      }

      const data = doc.data() as Template;
      // if a call id already exist, there's a conflict and call has already been created, just exit
      if (data.ongoingCallId) {
        return false;
      }

      transaction.set(newCallRef, newCallData);
      transaction.update(templateRef, { ongoingCallId: newCallRef.id });
      return true;
    });

    return success;
  }, [template, user]);

  const endCall = useCallback(async () => {
    if (!template || !template.ongoingCallId) {
      console.warn('Cannot end call when no call exist');
      return;
    }

    const batch = db.batch();
    const templateRef = db.collection(Collections.TEMPLATES).doc(template.id);
    const callRef = db.collection(Collections.CALLS).doc(template.ongoingCallId);

    // NOTE: we want this operation to be quick, so
    // not going to update activitiesSnapshot here,
    // depending on webhook to do that.
    batch.update(templateRef, { ongoingCallId: null });
    batch.update(callRef, { isFinished: true });

    await batch.commit();
  }, [template]);

  return {
    call: ongoingCall,
    createCall,
    endCall,
  };
}
