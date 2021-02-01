import { useEffect, useCallback } from 'react';
import { rtdb } from '~/utils/firebase';
import { LocalModel, Call } from '~/firebase/schema-types';
import {
  ReactionTypes,
  CallsRTDBRoot,
  ReactionsDataKey,
  ReactionsCountDataKey,
  ReactionType,
} from '~/firebase/rtdb-types';
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

  const createReaction = useCallback(
    (type: ReactionTypes) => {
      if (!call || !user) {
        return;
      }

      const nowMs = new Date().getTime();
      const reactionData: ReactionType = {
        uid: user.uid,
        type,
        createdAt: nowMs,
      };

      // should generate a relatively unique key
      const key = `${user.uid}-${nowMs}`;
      const valueRef = rtdb.ref(`${CallsRTDBRoot}/${call.id}/${ReactionsDataKey}`);
      valueRef.update({
        [key]: reactionData,
      });

      // atomically update count via transaction
      const countRef = rtdb.ref(`${CallsRTDBRoot}/${call.id}/${ReactionsCountDataKey}`);
      countRef.transaction((countMap: { [key in ReactionTypes]: number } | null) => {
        const count = countMap?.[type] ? countMap?.[type] + 1 : 1;

        return {
          ...countMap,
          [type]: count,
        };
      });
    },
    [user, call],
  );

  return { createReaction };
}
