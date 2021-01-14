import { useEffect } from 'react';
import { useAppState } from '~/state';
import useIntercom from '~/hooks/useIntercom/useIntercom';

// this component just make sure intercom is loaded for its effects
export default function IntercomLoader() {
  const { user } = useAppState();
  const { boot, shutdown } = useIntercom();

  // boot intercom on startup
  useEffect(() => {
    if (user) {
      boot(user);
    } else {
      shutdown();
    }
  }, [user, boot, shutdown]);

  return null;
}
