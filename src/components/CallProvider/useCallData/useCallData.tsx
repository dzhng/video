import { useState, useEffect, useCallback } from 'react';
import { rtdb } from '~/utils/firebase';
import { LocalModel, Call, CallData, CallDataTypes } from '~/firebase/schema-types';

export default function useCallData(call?: LocalModel<Call>) {
  const [currentCallData, setCurrentCallData] = useState<CallData | undefined>(undefined);

  useEffect(() => {
    if (call) {
      const valueRef = rtdb.ref(`calls/${call.id}/callData`);

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

      const fullPath = `calls/${call.id}/callData/${key}${
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
