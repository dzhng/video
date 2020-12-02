import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Typography, AppBar, Toolbar } from '@material-ui/core';

import { useAppState } from '~/state';
import PendingWrite from '~/components/PendingWrite/PendingWrite';
import Menu from './Menu/Menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    toolbar: {
      [theme.breakpoints.down('xs')]: {
        padding: 0,
      },
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    displayName: {
      margin: '1.1em 0.6em',
      minWidth: '200px',
      fontWeight: 600,
    },
  }),
);

export default function MenuBar() {
  const classes = useStyles();
  const { user } = useAppState();

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.displayName} variant="body1">
          {user?.displayName}
        </Typography>
        <div className={classes.rightButtonContainer}>
          <PendingWrite />
          <Menu />
        </div>
      </Toolbar>
    </AppBar>
  );
}
