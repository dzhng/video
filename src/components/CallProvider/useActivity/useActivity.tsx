import { useEffect, useState, useCallback } from 'react';
import { rtdb } from '~/utils/firebase';
import {
  CallDataTypes,
  CallsRTDBRoot,
  CurrentActivityIDKey,
  ActivityDataKey,
  ActivityDataType,
} from '~/firebase/rtdb-types';
import { LocalModel, Call, Activity } from '~/firebase/schema-types';

export default function useActivity(call?: LocalModel<Call>) {
  const startActivity = useCallback(
    (activity: Activity) => {
      if (!call) {
        console.error('Cannot start activity if call is not loaded');
        return;
      }

      rtdb.ref(`${CallsRTDBRoot}/${call.id}/${CurrentActivityIDKey}`).set(activity.id);
    },
    [call],
  );

  const endActivity = useCallback(() => {
    if (!call) {
      console.error('Cannot update activity if call is not loaded');
      return;
    }

    rtdb.ref(`${CallsRTDBRoot}/${call.id}/${CurrentActivityIDKey}`).set(null);
  }, [call]);

  const [currentActivityId, setCurrentActivityId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (call) {
      const valueRef = rtdb.ref(`${CallsRTDBRoot}/${call.id}/${CurrentActivityIDKey}`);

      valueRef.on('value', (snapshot) => {
        setCurrentActivityId(snapshot.val());
      });

      return () => valueRef.off('value');
    } else {
      setCurrentActivityId(undefined);
    }
  }, [call]);

  // NOTE: be careful when using arrays within activityData
  // https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
  const updateActivityData = useCallback(
    (activity: Activity, path: string | null, value: CallDataTypes) => {
      if (!call) {
        console.error('Cannot update activity if call is not loaded');
        return;
      }

      const fullPath = `${CallsRTDBRoot}/${call.id}/${ActivityDataKey}/${activity.id}${
        path ? '/' + path.replace(/\./g, '/') : ''
      }`;
      rtdb.ref().update({
        [fullPath]: value,
      });
    },
    [call],
  );

  const [activityData, setActivityData] = useState<ActivityDataType | undefined>(undefined);

  useEffect(() => {
    if (call) {
      const valueRef = rtdb.ref(`${CallsRTDBRoot}/${call.id}/${ActivityDataKey}`);

      valueRef.on('value', (snapshot) => {
        setActivityData(snapshot.val() ?? {});
      });

      return () => valueRef.off('value');
    } else {
      setActivityData(undefined);
    }
  }, [call]);

  const hasActivityStarted = useCallback(
    (activity: Activity): boolean => {
      if (!activityData) {
        return false;
      }

      const data = activityData[activity.id];
      if (!data || Object.keys(data).length === 0) {
        return false;
      }

      return true;
    },
    [activityData],
  );

  const currentActivityData = currentActivityId ? activityData?.[currentActivityId] : undefined;

  return {
    startActivity,
    endActivity,
    currentActivityId,
    updateActivityData,
    currentActivityData,
    hasActivityStarted,
  };
}
