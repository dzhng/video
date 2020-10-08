import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppState } from '../../state';

export default function PrivateRoute(props: { children: React.ReactChild }): React.ReactElement {
  const router = useRouter();
  const { isAuthReady, user } = useAppState();

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push('/login');
    }
  }, [isAuthReady]); // eslint-disable-line

  return <>{props.children}</>;
}
