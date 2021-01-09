import { useEffect, useState, useCallback } from 'react';
import { rtdb } from '~/utils/firebase';
import {
  LocalModel,
  Call,
  Activity,
  ActivityDataTypes,
  ActivityData,
} from '~/firebase/schema-types';

export default function useActivity(call?: LocalModel<Call>) {
  const startActivity = useCallback(
    (activity: Activity) => {
      if (!call) {
        console.error('Cannot start activity if call is not loaded');
        return;
      }

      rtdb.ref(`calls/${call.id}/currentActivityId`).set(activity.id);
    },
    [call],
  );

  const endActivity = useCallback(() => {
    if (!call) {
      console.error('Cannot update activity if call is not loaded');
      return;
    }

    rtdb.ref(`calls/${call.id}/currentActivityId`).set(null);
  }, [call]);

  const [currentActivityId, setCurrentActivityId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (call) {
      const valueRef = rtdb.ref(`calls/${call.id}/currentActivityId`);

      valueRef.on('value', (snapshot) => {
        setCurrentActivityId(snapshot.val());
      });

      return () => valueRef.off('value');
    } else {
      setCurrentActivityId(undefined);
    }
  }, [call]);

  const updateActivityData = useCallback(
    (activity: Activity, path: string | null, value: ActivityDataTypes | object) => {
      if (!call) {
        console.error('Cannot update activity if call is not loaded');
        return;
      }

      const fullPath = `calls/${call.id}/activityData/${activity.id}${
        path ? '/' + path.replace('.', '/') : ''
      }`;
      rtdb.ref().update({
        [fullPath]: value,
      });
    },
    [call],
  );

  const [currentActivityData, setCurrentActivityData] = useState<ActivityData | undefined>(
    undefined,
  );

  useEffect(() => {
    if (call && currentActivityId) {
      const valueRef = rtdb.ref(`calls/${call.id}/activityData/${currentActivityId}`);

      valueRef.on('value', (snapshot) => {
        setCurrentActivityData(snapshot.val() ?? {});
      });

      return () => valueRef.off('value');
    } else {
      setCurrentActivityData(undefined);
    }
  }, [call, currentActivityId]);

  return {
    startActivity,
    endActivity,
    currentActivityId,
    updateActivityData,
    currentActivityData,
  };
}
