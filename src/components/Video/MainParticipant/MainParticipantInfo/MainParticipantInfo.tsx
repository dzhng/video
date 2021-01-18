import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import VideocamOff from '@material-ui/icons/VideocamOff';
import { LocalVideoTrack, Participant, RemoteVideoTrack } from 'twilio-video';

import useIsTrackSwitchedOff from '~/hooks/Video/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '~/hooks/Video/usePublications/usePublications';
import useTrack from '~/hooks/Video/useTrack/useTrack';
import BandwidthWarning from '~/components/Video/BandwidthWarning/BandwidthWarning';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gridArea: 'participantList',
  },
  isVideoSwitchedOff: {
    '& video': {
      filter: 'blur(4px) grayscale(1) brightness(0.5)',
    },
  },
  identity: {
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '0.1em 0.3em',
    margin: '1em',
    fontSize: '1.2em',
    display: 'inline-flex',
    '& svg': {
      marginLeft: '0.3em',
    },
  },
  infoContainer: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    width: '100%',
    padding: '0.4em',
  },
});

interface MainParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
}

export default function MainParticipantInfo({ participant, children }: MainParticipantInfoProps) {
  const classes = useStyles();

  const publications = usePublications(participant);
  const videoPublication = publications.find((p) => p.trackName.includes('camera'));
  const screenSharePublication = publications.find((p) => p.trackName.includes('screen'));
  const isVideoEnabled = Boolean(videoPublication);

  const videoTrack = useTrack(screenSharePublication || videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(
    videoTrack as LocalVideoTrack | RemoteVideoTrack,
  );

  return (
    <div
      data-cy-main-participant
      data-testid="container"
      className={clsx(classes.container, { [classes.isVideoSwitchedOff]: isVideoSwitchedOff })}
    >
      <div className={classes.infoContainer}>
        <h4 className={classes.identity}>
          {participant.identity}
          {!isVideoEnabled && <VideocamOff data-testid="camoff-icon" />}
        </h4>
      </div>
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </div>
  );
}
