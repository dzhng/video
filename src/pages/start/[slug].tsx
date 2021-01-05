import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import {
  Collections,
  LocalModel,
  Template,
  Call,
  Activity,
  ActivityDataTypes,
} from '~/firebase/schema-types';
import firebase, { db } from '~/utils/firebase';
import LoadingContainer from '~/containers/Loading/Loading';
import CallContainer from '~/containers/Call/Call';
import { useAppState } from '~/state';

// start a call with given template id
export default function StartPage() {
  const router = useRouter();
  const { user } = useAppState();
  const [ongoingCall, setOngoingCall] = useState<LocalModel<Call>>();
  const [template, setTemplate] = useState<LocalModel<Template>>();
  const [isHost, setIsHost] = useState<boolean | null>(null);

  const templateId = String(router.query.slug);

  // fetching template model
  useEffect(() => {
    if (!templateId) {
      return;
    }

    const unsubscribe = db
      .collection(Collections.TEMPLATES)
      .doc(templateId)
      .onSnapshot((result) => {
        setTemplate({
          id: result.id,
          ...(result.data() as Template),
        });
      });

    return unsubscribe;
  }, [templateId]);

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

  // setting isHost
  useEffect(() => {
    if (!template) {
      return;
    }

    if (!user) {
      setIsHost(false);
      return;
    }

    // if the user belongs to the workspace that the template is in, the user is a host
    const { workspaceId } = template;
    db.collection(Collections.WORKSPACES)
      .doc(workspaceId)
      .collection(Collections.MEMBERS)
      .doc(user.uid)
      .get()
      .then((result) => setIsHost(result.exists));
  }, [template, user]);

  // create a new call if one does not exist
  const handleCreateCall = useCallback(async (): Promise<boolean> => {
    if (!user) {
      return false;
    }

    // create a new call ref locally so we can have the ID
    const newCallRef = db.collection(Collections.CALLS).doc();
    const templateRef = db.collection(Collections.TEMPLATES).doc(templateId);

    const newCallData: Call = {
      templateId,
      creatorId: user.uid,
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
  }, [templateId, user]);

  const handleEndCall = useCallback(async () => {
    if (!template) {
      return;
    }

    const batch = db.batch();
    const templateRef = db.collection(Collections.TEMPLATES).doc(template.id);
    const callRef = db.collection(Collections.CALLS).doc(template.ongoingCallId ?? undefined);

    batch.update(templateRef, { ongoingCallId: null });
    batch.update(callRef, { isFinished: true });

    await batch.commit();
  }, [template]);

  const handleStartActivity = useCallback(
    (activity: Activity) => {
      if (!template || !template.ongoingCallId) {
        console.error('Cannot start activity if call is not loaded');
        return;
      }

      db.collection(Collections.CALLS).doc(template.ongoingCallId).update({
        currentActivityId: activity.id,
      });
    },
    [template],
  );

  const handleUpdateActivity = useCallback(
    (activity: Activity, path: string, value: ActivityDataTypes) => {
      if (!template || !template.ongoingCallId) {
        console.error('Cannot update activity if call is not loaded');
        return;
      }

      const fullPath = `activityData.${activity.id}.${path}`;

      db.collection(Collections.CALLS)
        .doc(template.ongoingCallId)
        .update({
          [fullPath]: value,
        });
    },
    [template],
  );

  const currentActivity = useMemo(() => {
    if (template && ongoingCall && ongoingCall.currentActivityId) {
      const activityId = ongoingCall.currentActivityId;
      return template.activities.find((activity) => activity.id === activityId);
    }
  }, [ongoingCall, template]);

  // when both template and host status is ready, show call conatiner
  return template && isHost !== null ? (
    <CallContainer
      template={template}
      isHost={isHost}
      call={ongoingCall}
      createCall={handleCreateCall}
      endCall={handleEndCall}
      currentActivity={currentActivity}
      startActivity={handleStartActivity}
      updateActivity={handleUpdateActivity}
    />
  ) : (
    <LoadingContainer />
  );
}
