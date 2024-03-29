import { useEffect } from 'react';
import { Room } from 'twilio-video';

import { Callback } from '~/utils/twilio-types';

export default function useHandleOnDisconnect(room: Room, onDisconnect: Callback) {
  useEffect(() => {
    room.on('disconnected', onDisconnect);
    return () => {
      room.off('disconnected', onDisconnect);
    };
  }, [room, onDisconnect]);
}
