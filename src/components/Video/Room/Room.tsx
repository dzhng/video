import React from 'react';
import { styled } from '@material-ui/core/styles';

import Controls from '~/components/Video/Controls/Controls';
import ReconnectingNotification from '~/components/Video/ReconnectingNotification/ReconnectingNotification';

import useHeight from '~/hooks/Video/useHeight/useHeight';

import Participants from './Participants';

const Container = styled('div')({
  position: 'relative',
  display: 'flex',
});

const ControlsContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  bottom: 0,
  left: 0,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
}));

export default function Room() {
  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  return (
    <Container style={{ height }}>
      <Participants />
      <ControlsContainer>
        <Controls />
      </ControlsContainer>
      <ReconnectingNotification />
    </Container>
  );
}
