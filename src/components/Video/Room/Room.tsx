import React, { useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Participant as ParticipantType } from 'twilio-video';
import { styled } from '@material-ui/core/styles';

import useHeight from '~/hooks/Video/useHeight/useHeight';
import useDisplayableParticipants from '~/hooks/Video/useDisplayableParticipants/useDisplayableParticipants';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import ActivityDisplay from '~/components/Activities/CallDisplay/ActivityDisplay';
import ScreenShareParticipant from '~/components/Video/ScreenShareParticipant/ScreenShareParticipant';
import useScreenShareParticipant from '~/hooks/Video/useScreenShareParticipant/useScreenShareParticipant';
import useSelectedParticipant from '~/components/Video/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import Participant from '~/components/Video/Participant/Participant';
import ReconnectingNotification from './ReconnectingNotification/ReconnectingNotification';
import ChatNotification from './ChatNotification/ChatNotification';
import ControlsBar from './ControlsBar/ControlsBar';

// use dynamic import here since layout requires measuring dom so can't SSR
const Layout = dynamic(() => import('~/components/Video/Layout/Layout'), { ssr: false });

const Container = styled('div')(() => ({}));

export default function Room() {
  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const pageHeight = useHeight();

  const { currentActivity } = useCallContext();
  const participants = useDisplayableParticipants();
  const screenShareParticipant = useScreenShareParticipant();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();

  const participantToItem = useCallback(
    (participant: ParticipantType) => ({
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
    () => participants.map(participantToItem),
    [participants, participantToItem],
  );

  const variant = currentActivity || screenShareParticipant ? 'focus' : 'grid';

  return (
    <Container style={{ height: pageHeight }}>
      <Layout
        variant={variant}
        gridItems={items}
        mainItem={screenShareParticipant ? <ScreenShareParticipant /> : <ActivityDisplay />}
        sideItem={<ActivityDrawer />}
        mainControls={<ControlsBar />}
        sideControls={<></>}
      />

      <ChatNotification />
      <ReconnectingNotification />
    </Container>
  );
}
