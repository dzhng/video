import { useEffect, useState } from 'react';
import { useAppState } from '~/state';
import { CONVERT_TOKEN_ENDPOINT } from '~/constants';

export default function useConvertToken() {
  const { user } = useAppState();
  const [token, setToken] = useState<string | null>(null);
  const [isFetchingToken, setIsFetchingToken] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      try {
        setIsFetchingToken(true);
        const idToken = await user!.getIdToken();
        const params = JSON.stringify({ idToken });

        const response = await fetch(`${CONVERT_TOKEN_ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: params,
        });

        const result = await response.text();
        setToken(result);
      } catch (e) {
        console.warn('Error fetching convert token', e);
      } finally {
        setIsFetchingToken(false);
      }
    };

    getToken();
  }, [user]);

  return { token, isFetchingToken };
}
