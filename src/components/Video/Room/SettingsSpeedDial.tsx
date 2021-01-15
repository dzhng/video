import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Backdrop } from '@material-ui/core';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import {
  MoreVert as SettingsIcon,
  ShareOutlined as ShareIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  FlipCameraIosOutlined as SwitchCameraIcon,
} from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import { isBrowser, updateClipboard } from '~/utils';
import useVideoContext from '~/hooks/Video/useVideoContext/useVideoContext';
import useFullScreenToggle from '~/hooks/Video/useFullScreenToggle/useFullScreenToggle';

const useStyles = makeStyles((theme) =>
  createStyles({
    button: {
      '& .MuiSpeedDial-fab': {
        color: 'white',
        backgroundColor: theme.palette.grey[900],

        '&:hover': {
          backgroundColor: theme.palette.grey[800],
        },
      },

      '& .MuiSpeedDialAction-staticTooltipLabel': {
        whiteSpace: 'nowrap',
      },
    },
  }),
);

type ActionsType = { icon: React.ReactNode; name: string; onClick(): void; disabled?: boolean }[];

export default function SettingsSpeedDial({ className }: { className?: string }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const { isToggleCameraSupported, shouldDisableVideoToggle, toggleCamera } = useVideoContext();
  const {
    isSupported: isFullScreenSupported,
    isFullScreen,
    toggleFullScreen,
  } = useFullScreenToggle();

  const location = isBrowser ? window.location : ({} as Location);
  const sharableCallLink = `${location.protocol}//${location.host}${location.pathname}`;

  const handleShare = useCallback(() => {
    updateClipboard(sharableCallLink);
    enqueueSnackbar('URL copied to clipboard!');
    setOpen(false);
  }, [sharableCallLink, enqueueSnackbar]);

  const handleToggleCamera = useCallback(() => {
    toggleCamera();
    setOpen(false);
  }, [toggleCamera]);

  const handleToggleFullScreen = useCallback(() => {
    toggleFullScreen();
    setOpen(false);
  }, [toggleFullScreen]);

  const actions = [
    { icon: <ShareIcon />, name: 'Copy Link', onClick: handleShare },
    isFullScreenSupported
      ? {
          icon: isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />,
          name: isFullScreen ? 'Exit Full Screen' : 'Full Screen',
          onClick: handleToggleFullScreen,
        }
      : null,
    isToggleCameraSupported
      ? {
          icon: <SwitchCameraIcon />,
          name: 'Swith Camera',
          onClick: handleToggleCamera,
          disabled: shouldDisableVideoToggle,
        }
      : null,
  ].filter((el) => !!el) as ActionsType;

  return (
    <>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="Call Settings"
        className={clsx(classes.button, className)}
        icon={<SettingsIcon />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
            FabProps={{
              disabled: action.disabled,
            }}
          />
        ))}
      </SpeedDial>
    </>
  );
}
