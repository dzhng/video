import React from 'react';
import '~/types';
import { useAppState } from '~/state';
import ErrorDialog from '~/components/ErrorDialog/ErrorDialog';
import { VideoProvider } from '~/components/VideoProvider';
import useConnectionOptions from '~/utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from '~/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import Room from '~/components/Room/Room';

export default function RoomPage() {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <Room />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
}
