import React from 'react';
import { styled } from '@material-ui/core/styles';

import Controls from '~/components/Call/Controls/Controls';
import LocalVideoPreview from '~/components/Call/LocalVideoPreview/LocalVideoPreview';
import ReconnectingNotification from '~/components/Call/ReconnectingNotification/ReconnectingNotification';
import MenuBar from '~/components/MenuBar/MenuBar';

import useHeight from '~/hooks/Call/useHeight/useHeight';
import useRoomState from '~/hooks/Call/useRoomState/useRoomState';

import Participants from './Participants';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
});

const Main = styled('main')({
  overflow: 'hidden',
});

export default function Layout() {
  const roomState = useRoomState();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  return (
    <Container style={{ height }}>
      <MenuBar />
      <Main>
        {roomState === 'disconnected' ? <LocalVideoPreview /> : <Participants />}
        <Controls />
      </Main>
      <ReconnectingNotification />
    </Container>
  );
}
