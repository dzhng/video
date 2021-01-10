import { useEffect, useState } from 'react';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';

type RoomStateType = 'disconnected' | 'connected' | 'reconnecting';

export default function useRoomState() {
  const { room } = useVideoContext();
  const [state, setState] = useState<RoomStateType>('disconnected');

  useEffect(() => {
    const setRoomState = () => setState((room.state ?? 'disconnected') as RoomStateType);
    setRoomState();

    room
      .on('disconnected', setRoomState)
      .on('reconnected', setRoomState)
      .on('reconnecting', setRoomState);

    return () => {
      room
        .off('disconnected', setRoomState)
        .off('reconnected', setRoomState)
        .off('reconnecting', setRoomState);
    };
  }, [room]);

  return state;
}
