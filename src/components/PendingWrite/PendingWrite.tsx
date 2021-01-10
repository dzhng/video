import { useEffect } from 'react';
import { useAppState } from '~/state';

export default function PendingWrite() {
  const { isWriting } = useAppState();

  useEffect(() => {
    // TODO: this doesn't look good, everytime it writes it looks like page load. find a better interaction here
    //setLoading(isWriting);
  }, [isWriting]);

  return null;
}
