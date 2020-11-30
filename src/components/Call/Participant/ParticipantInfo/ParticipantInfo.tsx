import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { ScreenShare, VideocamOff } from '@material-ui/icons';
import {
  LocalAudioTrack,
  LocalVideoTrack,
  Participant,
  RemoteAudioTrack,
  RemoteVideoTrack,
} from 'twilio-video';

import AudioLevelIndicator from '~/components/Call/AudioLevelIndicator/AudioLevelIndicator';
import BandwidthWarning from '~/components/Call/BandwidthWarning/BandwidthWarning';
import NetworkQualityLevel from '~/components/Call/NetworkQualityLevel/NetworkQualityLevel';

import usePublications from '~/hooks/Call/usePublications/usePublications';
import useIsTrackSwitchedOff from '~/hooks/Call/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useParticipantIsReconnecting from '~/hooks/Call/useParticipantIsReconnecting/useParticipantIsReconnecting';
import useTrack from '~/hooks/Call/useTrack/useTrack';

import ParticipantConnectionIndicator from './ParticipantConnectionIndicator/ParticipantConnectionIndicator';
import PinIcon from './PinIcon/PinIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: `${(theme.sidebarWidth * 9) / 16}px`,
      overflow: 'hidden',
      cursor: 'pointer',
      '& video': {
        filter: 'none',
      },
      '& svg': {
        stroke: 'black',
        strokeWidth: '0.8px',
      },
      [theme.breakpoints.down('xs')]: {
        height: theme.sidebarMobileHeight,
        width: `${(theme.sidebarMobileHeight * 16) / 9}px`,
        marginRight: '3px',
        fontSize: '10px',
      },
    },
    isVideoSwitchedOff: {
      '& video': {
        filter: 'blur(4px) grayscale(1) brightness(0.5)',
      },
    },
    infoContainer: {
      position: 'absolute',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      padding: '0.4em',
      width: '100%',
      background: 'transparent',
    },
    reconnectingContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(40, 42, 43, 0.75)',
      zIndex: 1,
    },
    hideVideo: {
      background: 'black',
    },
    identity: {
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '0.1em 0.3em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
);

interface ParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
}

export default function ParticipantInfo({
  participant,
  onClick,
  isSelected,
  children,
}: ParticipantInfoProps) {
  const publications = usePublications(participant);

  const audioPublication = publications.find((p) => p.kind === 'audio');
  const videoPublication = publications.find((p) => p.trackName.includes('camera'));

  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find((p) => p.trackName.includes('screen'));

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(
    videoTrack as LocalVideoTrack | RemoteVideoTrack,
  );

  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack | undefined;
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const classes = useStyles();

  return (
    <div
      className={clsx(classes.container, {
        [classes.isVideoSwitchedOff]: isVideoSwitchedOff,
      })}
      onClick={onClick}
      data-cy-participant={participant.identity}
      data-testid="container"
    >
      <div
        className={clsx(classes.infoContainer, { [classes.hideVideo]: !isVideoEnabled })}
        data-testid="info-container"
      >
        <div className={classes.infoRow}>
          <h4 className={classes.identity}>
            <ParticipantConnectionIndicator participant={participant} />
            {participant.identity}
          </h4>
          <NetworkQualityLevel participant={participant} />
        </div>
        <div>
          <AudioLevelIndicator audioTrack={audioTrack} />
          {!isVideoEnabled && <VideocamOff data-testid="camoff-icon" />}
          {isScreenShareEnabled && <ScreenShare data-testid="screenshare-icon" />}
          {isSelected && <PinIcon data-testid="pin-icon" />}
        </div>
      </div>
      {isParticipantReconnecting && (
        <div className={classes.reconnectingContainer}>
          <Typography data-testid="reconnecting">Reconnecting...</Typography>
        </div>
      )}
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </div>
  );
}
