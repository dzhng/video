import React from 'react';
import Link from 'next/link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Typography, AppBar, Toolbar } from '@material-ui/core';

import { useAppState } from '~/state';
import PendingWrite from '~/components/PendingWrite/PendingWrite';
import Menu from './Menu/Menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    title: {
      margin: '1.1em 0.6em',
      minWidth: '200px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    displayName: {
      textAlign: 'right',
      minWidth: '200px',
      fontWeight: 600,
    },
  }),
);

export default function MenuBar() {
  const classes = useStyles();
  const { user } = useAppState();

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Link href="/">
          <Typography className={classes.title} variant="body1">
            Aomni
          </Typography>
        </Link>
        <div className={classes.rightButtonContainer}>
          <PendingWrite />
          <Typography className={classes.displayName} variant="body1">
            {user?.displayName}
          </Typography>
          <Menu />
        </div>
      </Toolbar>
    </AppBar>
  );
}
