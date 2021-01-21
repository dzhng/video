import { useEffect } from 'react';
import { rtdb } from '~/utils/firebase';
import { LocalModel, Call } from '~/firebase/schema-types';
import { CallEvents, CallEmitterType } from '../events';

export type MessageTypes = 'text' | 'image' | 'file';
export interface MessageType {
  uid: string;
  type: MessageTypes;
  data: string; // raw text, image id, or file id
  createdAt: number; // need to be integer since rtdb don't support dates
}

export const ChatsDataKey = 'chats';
// TODO: support other channels in the future (host only, private 1-1)
export const PublicChatsChannelKey = 'all';
export const MessageTimeoutMs = 2000;

export default function useCallChat(events: CallEmitterType, call?: LocalModel<Call>) {
  useEffect(() => {
    if (call) {
      // query for new messages that came in AFTER this query is run
      const nowMs = new Date().getTime();
      const valueRef = rtdb
        .ref(`calls/${call.id}/callData/${ChatsDataKey}/${PublicChatsChannelKey}`)
        .orderByChild('createdAt')
        .startAt(nowMs);

      // when a new message is created, add it to state
      valueRef.on('child_added', (snapshot) => {
        const val = snapshot.val() as MessageType;
        events.emit(CallEvents.NEW_MESSAGE, val);
      });

      return () => valueRef.off('child_added');
    }
  }, [call, events]);

  return null;
}
