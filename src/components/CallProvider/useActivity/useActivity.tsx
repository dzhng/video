import { useCallback, useMemo } from 'react';
import { db } from '~/utils/firebase';
import {
  Collections,
  LocalModel,
  Template,
  Call,
  Activity,
  ActivityDataTypes,
  ActivityData,
} from '~/firebase/schema-types';

export default function useActivity(template: LocalModel<Template>, call?: LocalModel<Call>) {
  const startActivity = useCallback(
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

  const updateActivity = useCallback(
    (activity: Activity, path: string | null, value: ActivityDataTypes | object) => {
      if (!template || !template.ongoingCallId) {
        console.error('Cannot update activity if call is not loaded');
        return;
      }

      const fullPath = `activityData.${activity.id}${path ? '.' + path : ''}`;

      db.collection(Collections.CALLS)
        .doc(template.ongoingCallId)
        .update({
          [fullPath]: value,
        });
    },
    [template],
  );

  const endActivity = useCallback(() => {
    if (!template || !template.ongoingCallId) {
      console.error('Cannot update activity if call is not loaded');
      return;
    }

    db.collection(Collections.CALLS).doc(template.ongoingCallId).update({
      currentActivityId: null,
    });
  }, [template]);

  const currentActivity = useMemo(() => {
    if (template && call && call.currentActivityId) {
      const activityId = call.currentActivityId;
      return template.activities.find((activity) => activity.id === activityId);
    }
  }, [call, template]);

  const currentActivityData = useMemo<ActivityData | undefined>(() => {
    if (call && currentActivity) {
      return (call.activityData ? call.activityData[currentActivity.id] : {}) as ActivityData;
    }
  }, [call, currentActivity]);

  return {
    currentActivity,
    startActivity,
    updateActivity,
    endActivity,
    currentActivityData,
  };
}
