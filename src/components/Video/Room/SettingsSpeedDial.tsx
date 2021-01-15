import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Backdrop } from '@material-ui/core';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import {
  MoreVert as SettingsIcon,
  ShareOutlined as ShareIcon,
  Fullscreen as FullscreenIcon,
  SwitchVideoOutlined as SwitchCameraIcon,
} from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import { isBrowser, updateClipboard } from '~/utils';

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

export default function SettingsSpeedDial({ className }: { className?: string }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const location = isBrowser ? window.location : ({} as Location);
  const sharableCallLink = `${location.protocol}//${location.host}${location.pathname}`;

  const handleShare = useCallback(() => {
    updateClipboard(sharableCallLink);
    enqueueSnackbar('URL copied to clipboard!');
    setOpen(false);
  }, [sharableCallLink, enqueueSnackbar]);

  const actions = [
    { icon: <ShareIcon />, name: 'Copy Link', onClick: handleShare },
    { icon: <FullscreenIcon />, name: 'Full Screen', onClick: () => null },
    { icon: <SwitchCameraIcon />, name: 'Swith Camera', onClick: () => null },
  ];

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
          />
        ))}
      </SpeedDial>
    </>
  );
}
