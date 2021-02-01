import { useCallback, useEffect, useRef, useState } from 'react';
import { EventEmitter } from 'events';
import Video, { ConnectOptions, LocalTrack, LocalVideoTrack, Room } from 'twilio-video';
import { isMobile, isBrowser } from '~/utils';
import { Callback } from '~/utils/twilio-types';

if (isBrowser) {
  // @ts-ignore
  window.TwilioVideo = Video;
}

export default function useRoom(
  localTracks: LocalTrack[],
  onError: Callback,
  options?: ConnectOptions,
) {
  const [room, setRoom] = useState<Room>(new EventEmitter() as Room);
  const [isConnecting, setIsConnecting] = useState(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    // This allows the connect function to always access the most recent version of the options object. This allows us to
    // reliably use the connect function at any time.
    optionsRef.current = options;
  }, [options]);

  const connect = useCallback(
    (token) => {
      setIsConnecting(true);

      // only connect with enabled video tracks, since we don't want to publish stopped or disabled videos
      // we need to special case video here since it's the track type that gets published/unpublished
      // on user toggle (audio just has enabled/disabled but doesnt unpublish the track)
      const enabledLocalTracks = localTracks.filter((track) => {
        if (track.kind === 'video') {
          const vTrack = track as LocalVideoTrack;
          return vTrack.isEnabled && !vTrack.isStopped;
        } else {
          return true;
        }
      });

      return Video.connect(token, { ...optionsRef.current, tracks: enabledLocalTracks }).then(
        (newRoom) => {
          setRoom(newRoom);
          const disconnect = () => newRoom.disconnect();

          // This app can add up to 13 'participantDisconnected' listeners to the room object, which can trigger
          // a warning from the EventEmitter object. Here we increase the max listeners to suppress the warning.
          newRoom.setMaxListeners(15);

          newRoom.once('disconnected', () => {
            // Reset the room only after all other `disconnected` listeners have been called.
            setTimeout(() => setRoom(new EventEmitter() as Room));
            window.removeEventListener('beforeunload', disconnect);

            if (isMobile) {
              window.removeEventListener('pagehide', disconnect);
            }
          });

          // @ts-ignore
          window.twilioRoom = newRoom;

          newRoom.localParticipant.videoTracks.forEach((publication) =>
            // All video tracks are published with 'low' priority because the video track
            // that is displayed in the main component will have it's priority
            // set to 'high' in the component itself
            publication.setPriority('low'),
          );

          setIsConnecting(false);

          // Add a listener to disconnect from the room when a user closes their browser
          window.addEventListener('beforeunload', disconnect);

          if (isMobile) {
            // Add a listener to disconnect from the room when a mobile user closes their browser
            window.addEventListener('pagehide', disconnect);
          }
        },
        (error) => {
          onError(error);
          setIsConnecting(false);
        },
      );
    },
    [localTracks, onError],
  );

  return { room, isConnecting, connect };
}
