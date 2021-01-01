import React from 'react';
import { styled } from '@material-ui/core/styles';
import ParticipantStrip from '~/components/Video/ParticipantStrip/ParticipantStrip';
import MainParticipant from '~/components/Video/MainParticipant/MainParticipant';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: `${theme.sidebarWidth}px 1fr`,
  gridTemplateAreas: '". participantList"',
  gridTemplateRows: '100%',
  [theme.breakpoints.down('xs')]: {
    gridTemplateAreas: '"participantList" "."',
    gridTemplateColumns: `auto`,
    gridTemplateRows: `calc(100% - ${theme.sidebarMobileHeight + 12}px) ${
      theme.sidebarMobileHeight + 6
    }px`,
    gridGap: '6px',
  },
}));

export default function Participants() {
  return (
    <Container>
      <ParticipantStrip />
      <MainParticipant />
    </Container>
  );
}
