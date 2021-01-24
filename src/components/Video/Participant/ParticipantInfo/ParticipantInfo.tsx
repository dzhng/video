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

import AudioLevelIndicator, {
  useVolume,
} from '~/components/Video/AudioLevelIndicator/AudioLevelIndicator';
import BandwidthWarning from '~/components/Video/BandwidthWarning/BandwidthWarning';
import NetworkQualityLevel from '~/components/Video/NetworkQualityLevel/NetworkQualityLevel';

import useDominantSpeaker from '~/hooks/Video/useDominantSpeaker/useDominantSpeaker';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import usePublications from '~/hooks/Video/usePublications/usePublications';
import useIsTrackSwitchedOff from '~/hooks/Video/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useParticipantIsReconnecting from '~/hooks/Video/useParticipantIsReconnecting/useParticipantIsReconnecting';
import useTrack from '~/hooks/Video/useTrack/useTrack';
import useUserInfo from '~/hooks/useUserInfo/useUserInfo';

import ParticipantConnectionIndicator from './ParticipantConnectionIndicator/ParticipantConnectionIndicator';
//import PinIcon from './PinIcon/PinIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[7],
      overflow: 'hidden',

      // for speaker glow transitions
      transition: 'box-shadow 0.8s',

      // fix webkit bug where borderRadius doesn't render
      transform: 'translateZ(0)',

      // make the size a little bit bigger and add margin to fix issue
      // where some android browsers will display video with a 1px white border
      '& video': {
        width: 'calc(100% + 4px)',
        height: 'calc(100% + 4px)',
        marginTop: '-2px',
        marginLeft: '-2px',
        filter: 'none',
      },
      '& svg': {
        stroke: 'black',
        strokeWidth: '0.8px',
      },
    },
    isVideoSwitchedOff: {
      '& video': {
        filter: 'blur(4px) grayscale(1) brightness(0.5)',
      },
    },
    isDominantSpeaker: (props: { volume: number }) => ({
      boxShadow: `0px 0px 16px ${4 + props.volume / 2}px rgb(255 255 255 / 60%)`,
    }),
    isInterrupting: (props: { volume: number }) => ({
      boxShadow: `0px 0px 16px ${4 + props.volume / 2}px ${theme.palette.error.main}60`,
    }),
    infoContainer: {
      position: 'absolute',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
      padding: '0.4em',
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
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '1%',
    },
    indicators: {
      color: 'white',
      display: 'flex',
      alignItems: 'center',

      '& svg:first-child': {
        height: 34,
        width: 34,
        padding: 5,
        backgroundColor: theme.palette.grey[800],
        borderRadius: 17,
      },
      '& svg': {
        marginRight: 5,
      },
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
  //isSelected,
  children,
}: ParticipantInfoProps) {
  const { isVideoEnabled } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const publications = usePublications(participant);

  const audioPublication = publications.find((p) => p.kind === 'audio');
  const videoPublication = publications.find((p) => p.trackName.includes('camera'));

  const isScreenShareEnabled = publications.find((p) => p.trackName.includes('screen'));

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(
    videoTrack as LocalVideoTrack | RemoteVideoTrack,
  );

  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack | undefined;
  const volume = useVolume(audioTrack);
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const classes = useStyles({ volume: volume ?? 0 });
  const userInfo = useUserInfo(participant.identity);

  // dominant speaker needs to be detected by twilio AND there must be some volume to
  // be qualified as dominant speaker. Note that we are adding rules to twilio's original
  // rules since our use cases requires very sensitive dominant speaker detection.
  // (needs to unset the minute the speaker stops speaking)
  const isSpeaking = volume !== undefined && volume > 3;
  const isDominantSpeaker = participant.identity === dominantSpeaker?.identity && isSpeaking;

  // you are interrupting when you are not the dominant speaker, but there is another dominant
  // speaker and you are speaking
  const isInterrupting = Boolean(!isDominantSpeaker && dominantSpeaker && isSpeaking);

  return (
    <div
      className={clsx(classes.container, {
        [classes.isVideoSwitchedOff]: isVideoSwitchedOff,
        [classes.isDominantSpeaker]: isDominantSpeaker,
        [classes.isInterrupting]: isInterrupting,
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
            <span>{userInfo?.displayName}</span>
          </h4>
          <NetworkQualityLevel participant={participant} />
        </div>
        <div className={classes.indicators}>
          <AudioLevelIndicator volume={volume} />
          {!isVideoEnabled && <VideocamOff data-testid="camoff-icon" />}
          {isScreenShareEnabled && <ScreenShare data-testid="screenshare-icon" />}
          {/*isSelected && <PinIcon data-testid="pin-icon" />*/}
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
