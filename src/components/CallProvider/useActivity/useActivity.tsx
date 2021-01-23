import { useEffect, useState, useCallback } from 'react';
import { rtdb } from '~/utils/firebase';
import { CallsRTDBRoot, CurrentActivityIDKey, ActivityDataKey } from '~/constants';
import { LocalModel, Call, Activity, CallDataTypes, CallData } from '~/firebase/schema-types';

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

  const [currentActivityData, setCurrentActivityData] = useState<CallData | undefined>(undefined);

  useEffect(() => {
    if (call && currentActivityId) {
      const valueRef = rtdb.ref(
        `${CallsRTDBRoot}/${call.id}/${ActivityDataKey}/${currentActivityId}`,
      );

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
