import React, { useCallback, useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import { styled } from '@material-ui/core/styles';
import { Fab, Tooltip, Menu, MenuItem } from '@material-ui/core';
import { MoreVert as SettingsIcon } from '@material-ui/icons';
import useDimensions from 'react-cool-dimensions';
import { useSnackbar } from 'notistack';

import { isBrowser, updateClipboard } from '~/utils';
import Controls from '~/components/Video/Controls/Controls';
import ReconnectingNotification from '~/components/Video/ReconnectingNotification/ReconnectingNotification';
import useHeight from '~/hooks/Video/useHeight/useHeight';
import useParticipants from '~/hooks/Video/useParticipants/useParticipants';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import ActivityDisplay from '~/components/Activities/CallDisplay/ActivityDisplay';
import useSelectedParticipant from '~/components/Video/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import Participant from '~/components/Video/Participant/Participant';

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
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  '& .fab': {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.grey[900],
    color: 'white',
  },
}));

export default function Room() {
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

  // for settings menu
  const anchorRef = useRef<HTMLDivElement>(null);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { currentActivity } = useCallContext();
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

  const location = isBrowser ? window.location : ({} as Location);
  const sharableCallLink = `${location.protocol}//${location.host}${location.pathname}`;

  const handleShare = useCallback(() => {
    updateClipboard(sharableCallLink);
    enqueueSnackbar('URL copied to clipboard!');
    setSettingsMenuOpen(false);
  }, [sharableCallLink, enqueueSnackbar]);

  const variant = currentActivity ? 'focus' : 'grid';

  return (
    <Container style={{ height: pageHeight }}>
      <LayoutContainer ref={ref}>
        <Layout
          variant={variant}
          width={width}
          height={height}
          gridItems={items}
          mainItem={<ActivityDisplay />}
        />
      </LayoutContainer>
      <ControlsBar>
        <div className="left"></div>

        <Controls />

        <div className="right">
          <Tooltip title="Copy Call Link" placement="top" PopperProps={{ disablePortal: true }}>
            <div ref={anchorRef}>
              <Fab className="fab" onClick={() => setSettingsMenuOpen((state) => !state)}>
                <SettingsIcon />
              </Fab>
            </div>
          </Tooltip>
        </div>
      </ControlsBar>
      <ReconnectingNotification />

      <Menu
        open={settingsMenuOpen}
        onClose={() => setSettingsMenuOpen((state) => !state)}
        anchorEl={anchorRef.current}
      >
        <MenuItem disabled>Call Settings</MenuItem>
        <MenuItem onClick={handleShare}>Copy share link</MenuItem>
      </Menu>
    </Container>
  );
}
