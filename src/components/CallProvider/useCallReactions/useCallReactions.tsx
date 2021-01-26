import { useEffect } from 'react';
import { rtdb } from '~/utils/firebase';
import { LocalModel, Call } from '~/firebase/schema-types';
import { CallsRTDBRoot, ReactionsDataKey, ReactionType } from '~/firebase/rtdb-types';
import { useAppState } from '~/state';
import { CallEvents, CallEmitterType } from '../events';

export default function useCallReactions(events: CallEmitterType, call?: LocalModel<Call>) {
  const { user } = useAppState();

  useEffect(() => {
    if (call && user) {
      // query for new messages that came in AFTER this query is run
      const nowMs = new Date().getTime();
      const valueRef = rtdb
        .ref(`${CallsRTDBRoot}/${call.id}/${ReactionsDataKey}`)
        .orderByChild('createdAt')
        .startAt(nowMs);

      // when a new message is created, add it to state
      valueRef.on('child_added', (snapshot) => {
        const val = snapshot.val() as ReactionType;
        events.emit(CallEvents.NEW_REACTION, val);
      });

      return () => valueRef.off('child_added');
    }
  }, [call, user, events]);

  return null;
}