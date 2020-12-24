import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, AppBar, Toolbar } from '@material-ui/core';

import { useAppState } from '~/state';
import PendingWrite from '~/components/PendingWrite/PendingWrite';
import Menu from './Menu/Menu';
import Nav from './Nav/Nav';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      boxShadow: 'none',
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      backgroundColor: 'white',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    displayName: {
      textAlign: 'right',
      minWidth: '200px',
    },
    title: {
      minWidth: '200px',
      cursor: 'pointer',
    },
    main: {
      flexGrow: 1,
    },
    content: {
      padding: theme.spacing(3),
    },
  }),
);

export default function MenuBar({ children }: { children: React.ReactChild }) {
  const classes = useStyles();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAppState();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  // only show nav on root page
  const showNav = router.pathname === '/';

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="default" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Link href="/">
            <Typography className={classes.title} variant="h2">
              Aomni
            </Typography>
          </Link>
          <div className={classes.rightButtonContainer}>
            <PendingWrite />
            <Typography className={classes.displayName} variant="h4">
              {user?.displayName}
            </Typography>
            <Menu />
          </div>
        </Toolbar>
      </AppBar>

      {showNav && <Nav mobileOpen={mobileOpen} toggleOpen={handleDrawerToggle} />}

      <main className={classes.main}>
        <div className={classes.toolbar} />
        <div className={classes.content}>{children}</div>
      </main>
    </div>
  );
}
