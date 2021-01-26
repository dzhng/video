import React, { useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { Participant as ParticipantType } from 'twilio-video';
import { styled } from '@material-ui/core/styles';
import { Fab, Tooltip, Hidden } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import useDimensions from 'react-cool-dimensions';

import Controls from '~/components/Video/Controls/Controls';
import useHeight from '~/hooks/Video/useHeight/useHeight';
import useDisplayableParticipants from '~/hooks/Video/useDisplayableParticipants/useDisplayableParticipants';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import ActivityDisplay from '~/components/Activities/CallDisplay/ActivityDisplay';
import ScreenShareParticipant from '~/components/Video/ScreenShareParticipant/ScreenShareParticipant';
import useScreenShareParticipant from '~/hooks/Video/useScreenShareParticipant/useScreenShareParticipant';
import useSelectedParticipant from '~/components/Video/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import Participant from '~/components/Video/Participant/Participant';
import SettingsSpeedDial from '~/components/Video/SettingsSpeedDial/SettingsSpeedDial';
import { useStyles } from '~/components/Video/Controls/styles';
import ReconnectingNotification from './ReconnectingNotification/ReconnectingNotification';
import ChatNotification from './ChatNotification/ChatNotification';

// use dynamic import here since layout requires measuring dom so can't SSR
const Layout = dynamic(() => import('~/components/Video/Layout/Layout'), { ssr: false });

const Container = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const LayoutContainer = styled('div')({
  flexGrow: 1,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'stretch',
});

const ControlsBar = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  // no need to pad top since layout on top will already have a lot of padding
  paddingTop: 0,
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  '& .fab': {
    backgroundColor: theme.palette.grey[900],
    color: 'white',
  },

  '& .rightSpeedDial': {
    position: 'absolute',
    bottom: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

export default function Room() {
  const classes = useStyles();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const pageHeight = useHeight();

  // measure the width and height of LayoutContainer feed into layout component to
  // calculate grid sizes. Make sure LayoutContainer has overflow set to hidden so
  // that sizes can be calculate correctly.
  // (if not set, size will overflow and will be wrong)
  const { ref, width, height } = useDimensions<HTMLDivElement>({ useBorderBoxSize: true });

  const { currentActivity, setIsActivityDrawerOpen } = useCallContext();
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
      <LayoutContainer ref={ref}>
        <Layout
          variant={variant}
          width={width}
          height={height}
          gridItems={items}
          mainItem={screenShareParticipant ? <ScreenShareParticipant /> : <ActivityDisplay />}
        />
      </LayoutContainer>

      <ControlsBar>
        <div className="left" style={{ width: 72 }}>
          <Hidden smUp implementation="js">
            <Tooltip title="Activities" placement="top" PopperProps={{ disablePortal: true }}>
              <div>
                <Fab
                  className={clsx('fab', classes.fab)}
                  onClick={() => setIsActivityDrawerOpen(true)}
                >
                  <MenuIcon />
                </Fab>
              </div>
            </Tooltip>
          </Hidden>
        </div>

        <Controls />

        <div className="right" style={{ width: 72, height: 72, position: 'relative' }}>
          <SettingsSpeedDial className="rightSpeedDial" />
        </div>
      </ControlsBar>

      <ChatNotification />
      <ReconnectingNotification />
    </Container>
  );
}
