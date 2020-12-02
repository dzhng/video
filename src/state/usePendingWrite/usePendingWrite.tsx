import { useEffect, useState } from 'react';
import { db } from '~/utils/firebase';

// NOTE there is a bug here, because waitForPendingWrites ONLY waits for writes added BEFORE it is called. There is a case where the writes that was added after it's called will be missed (if previous writes are still going).
// However, this is a edge case so not going to bother fixing.
export default function usePendingWrite() {
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    const waitForWrite = async () => {
      await db.waitForPendingWrites();
      setIsWriting(false);
    };

    if (isWriting) {
      waitForWrite();
    }
  }, [isWriting]);

  const markIsWriting = () => setIsWriting(true);

  return { isWriting, markIsWriting };
}
