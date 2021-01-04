import { useState, useEffect } from 'react';
import { Collections, LocalModel, User } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';

// fetches user data from given uid
export default function useUserInfo(uid?: string): LocalModel<User> | null {
  const [data, setData] = useState<LocalModel<User> | null>(null);

  useEffect(() => {
    if (!uid) {
      setData(null);
      return;
    }

    // since these are meant to be called often with every user, prioritize cached data, it doesn't matter if it's stale since user data rarely updates
    db.collection(Collections.USERS)
      .doc(uid)
      .get({ source: 'cache' })
      .catch(() => {
        // if cache fails, get it again but from server
        return db.collection(Collections.USERS).doc(uid).get();
      })
      .then((record) => {
        setData({
          id: record.id,
          ...(record.data() as User),
        });
      });
  }, [uid]);

  return data;
}
