import { useEffect } from 'react';
import { setLoading } from '~/utils/progress-indicator';

import { useAppState } from '~/state';

export default function PendingWrite() {
  const { isWriting } = useAppState();

  useEffect(() => {
    setLoading(isWriting);
  }, [isWriting]);

  return null;
}
