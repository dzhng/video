import React from 'react';
import { styled } from '@material-ui/core/styles';
import useDimensions from 'react-cool-dimensions';

import Controls from '~/components/Video/Controls/Controls';
import ReconnectingNotification from '~/components/Video/ReconnectingNotification/ReconnectingNotification';
import useHeight from '~/hooks/Video/useHeight/useHeight';
import Layout from '~/components/Video/Layout/Layout';
import Participants from './Participants';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.grey[900],
}));

const LayoutContainer = styled('div')({
  flexGrow: 1,
});

const ControlsBar = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
}));

export default function Room() {
  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const pageHeight = useHeight();

  // measure the width and height of LayoutContainer to feed into layout component
  const { ref, width, height } = useDimensions<HTMLDivElement>();

  // generate random data for now
  const items = [1, 2, 3, 4, 5, 6, 7, 8].map((key) => ({
    key: String(key),
    node: <div style={{ width: '100%', height: '100%' }} />,
  }));

  return (
    <Container style={{ height: pageHeight }}>
      <LayoutContainer ref={ref}>
        <Layout variant="grid" width={width} height={height} gridItems={items} />
      </LayoutContainer>
      <ControlsBar>
        <Controls />
      </ControlsBar>
      <ReconnectingNotification />
    </Container>
  );
}
