import React from 'react';
import { styled } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Fab, Tooltip, Hidden } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import Controls from '~/components/Video/Controls/Controls';
import SettingsSpeedDial from '~/components/Video/SettingsSpeedDial/SettingsSpeedDial';
import { useStyles } from '~/components/Video/Controls/styles';

const Container = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  // no need to pad top since layout on top will already have a lot of padding
  paddingTop: 0,
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'space-between',
  // controls should always be aligned bottom to ensure equal padding on bottom
  alignItems: 'flex-end',

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

export default function ControlsBar() {
  const classes = useStyles();
  const { setIsActivityDrawerOpen } = useCallContext();

  return (
    <Container>
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

      <div className="right" style={{ width: 72, minHeight: 1, position: 'relative' }}>
        <SettingsSpeedDial className="rightSpeedDial" />
      </div>
    </Container>
  );
}
