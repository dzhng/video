import React from 'react';
import { styled } from '@material-ui/core/styles';

import Controls from '~/components/Video/Controls/Controls';
import LocalVideoPreview from '~/components/Video/LocalVideoPreview/LocalVideoPreview';
import ReconnectingNotification from '~/components/Video/ReconnectingNotification/ReconnectingNotification';

import useHeight from '~/hooks/Video/useHeight/useHeight';
import useRoomState from '~/hooks/Video/useRoomState/useRoomState';

import Participants from './Participants';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
});

const Main = styled('main')({
  overflow: 'hidden',
});

export default function Room() {
  const roomState = useRoomState();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  return (
    <Container style={{ height }}>
      <Main>
        {roomState === 'disconnected' ? <LocalVideoPreview /> : <Participants />}
        <Controls />
      </Main>
      <ReconnectingNotification />
    </Container>
  );
}
