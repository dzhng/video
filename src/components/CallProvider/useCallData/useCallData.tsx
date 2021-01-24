import { useState, useEffect, useCallback } from 'react';
import { rtdb } from '~/utils/firebase';
import { CallsRTDBRoot } from '~/constants';
import { LocalModel, Call, CallData, CallDataTypes } from '~/firebase/schema-types';

export default function useCallData(call?: LocalModel<Call>) {
  const [currentCallData, setCurrentCallData] = useState<CallData>();

  useEffect(() => {
    if (call) {
      const valueRef = rtdb.ref(`${CallsRTDBRoot}/${call.id}`);

      valueRef.on('value', (snapshot) => {
        setCurrentCallData(snapshot.val() ?? {});
      });

      return () => valueRef.off('value');
    } else {
      setCurrentCallData(undefined);
    }
  }, [call]);

  const updateCallData = useCallback(
    (key: string, path: string | null, value: CallDataTypes) => {
      if (!call) {
        console.error('Cannot update call if call is not loaded');
        return;
      }

      const fullPath = `${CallsRTDBRoot}/${call.id}/${key}${
        path ? '/' + path.replace(/\./g, '/') : ''
      }`;
      rtdb.ref().update({
        [fullPath]: value,
      });
    },
    [call],
  );

  return { currentCallData, updateCallData };
}
