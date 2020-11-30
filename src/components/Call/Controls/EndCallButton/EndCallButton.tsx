import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import CallEnd from '@material-ui/icons/CallEnd';
import { Fab, Tooltip } from '@material-ui/core';

import useVideoContext from '~/hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  }),
);

export default function EndCallButton(props: object) {
  const classes = useStyles();
  const { room } = useVideoContext();

  return (
    <Tooltip
      title={'End Call'}
      onClick={() => room.disconnect()}
      placement="top"
      PopperProps={{ disablePortal: true }}
    >
      <Fab className={classes.fab} color="primary" {...props}>
        <CallEnd />
      </Fab>
    </Tooltip>
  );
}
