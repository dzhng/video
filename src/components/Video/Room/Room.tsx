import React, { useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import { styled } from '@material-ui/core/styles';
import useDimensions from 'react-cool-dimensions';

import Controls from '~/components/Video/Controls/Controls';
import ReconnectingNotification from '~/components/Video/ReconnectingNotification/ReconnectingNotification';
import useHeight from '~/hooks/Video/useHeight/useHeight';
import useParticipants from '~/hooks/Video/useParticipants/useParticipants';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useSelectedParticipant from '~/components/Video/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import Participant from '~/components/Video/Participant/Participant';

// use dynamic import here since layout requires measuring dom so can't SSR
const Layout = dynamic(() => import('~/components/Video/Layout/Layout'), { ssr: false });

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

  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();

  const participantToItem = useCallback(
    (participant: LocalParticipant | RemoteParticipant) => ({
      key: participant.sid ? participant.sid : 'local',
      node: (
        <Participant
          participant={participant}
          isSelected={selectedParticipant === participant}
          onClick={() => setSelectedParticipant(participant)}
        />
      ),
    }),
    [selectedParticipant, setSelectedParticipant],
  );

  const items = useMemo<{ key: string; node: React.ReactNode }[]>(
    () => [participantToItem(localParticipant)].concat(participants.map(participantToItem)),
    [localParticipant, participants, participantToItem],
  );

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
