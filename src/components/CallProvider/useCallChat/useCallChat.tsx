import { useState, useEffect, useCallback, useRef } from 'react';
import { rtdb } from '~/utils/firebase';
import { LocalModel, Call } from '~/firebase/schema-types';

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

export default function useCallChat(call?: LocalModel<Call>) {
  // track mounted state so timers don't set state after unmount
  const isMounted = useRef(true);
  // array of last messages received in last x seconds
  // we want to show those to the user in a notification
  const [notiMessages, setNotiMesages] = useState<MessageType[]>([]);

  // on unmount unset mounted flag
  useEffect(() => () => {
    isMounted.current = false;
  });

  // TODO: there could be a better way here which is to just filter the last few messages by timestamp. Try this if/when all messaging logic is consoldated into this hook.
  useEffect(() => {
    if (call) {
      const valueRef = rtdb.ref(
        `calls/${call.id}/callData/${ChatsDataKey}/${PublicChatsChannelKey}`,
      );

      // when a new message is created, add it to state
      valueRef.on('child_added', (snapshot) => {
        const val = snapshot.val() as MessageType;
        setNotiMesages((state) => [...state, val]);

        // in given timeout, remove the message that was just added
        setTimeout(() => {
          if (isMounted.current) {
            setNotiMesages((state) => state.filter((v) => v !== val));
          }
        }, MessageTimeoutMs);
      });

      return () => valueRef.off('child_added');
    }
  }, [call]);

  const clearNotiMessage = useCallback((message: MessageType) => {
    setNotiMesages((state) => state.filter((m) => m !== message));
  }, []);

  return { notiMessages, clearNotiMessage };
}
