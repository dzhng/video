import React from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { LocalVideoTrack, Participant, RemoteVideoTrack } from 'twilio-video';

import useIsTrackSwitchedOff from '~/hooks/Video/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '~/hooks/Video/usePublications/usePublications';
import useTrack from '~/hooks/Video/useTrack/useTrack';
import BandwidthWarning from '~/components/Video/BandwidthWarning/BandwidthWarning';

const useStyles = makeStyles((theme) =>
  createStyles({
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
      height: 22,
      background: 'rgba(255, 255, 255, 0.85)',
      borderRadius: 11,
      padding: '0.1em 0.6em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      marginRight: theme.spacing(1),

      '& span': {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      },
    },
    infoContainer: {
      position: 'absolute',
      zIndex: 1,
      height: '100%',
      width: '100%',
      padding: '0.4em',
    },
  }),
);

interface ScreenShareParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
}

export default function ScreenShareParticipantInfo({
  participant,
  children,
}: ScreenShareParticipantInfoProps) {
  const classes = useStyles();

  const publications = usePublications(participant);
  const screenSharePublication = publications.find((p) => p.trackName.includes('screen'));

  const videoTrack = useTrack(screenSharePublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(
    videoTrack as LocalVideoTrack | RemoteVideoTrack,
  );

  return (
    <div
      data-testid="container"
      className={clsx(classes.container, { [classes.isVideoSwitchedOff]: isVideoSwitchedOff })}
    >
      <div className={classes.infoContainer}>
        <h4 className={classes.identity}>{participant.identity}</h4>
      </div>
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </div>
  );
}
