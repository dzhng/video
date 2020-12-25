import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { ArrowBackIosOutlined as BackIcon } from '@material-ui/icons';

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
    toolbarSpacer: theme.mixins.toolbar,
    toolbar: {
      display: 'flex',
    },
    toolbarContent: {
      flexGrow: 1,
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      ...theme.mixins.toolbar,
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    displayName: {
      textAlign: 'right',
    },
    title: {
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

export default function MenuBar({
  showNav,
  previousPage,
  children,
}: {
  showNav?: boolean;
  previousPage?: string;
  children: React.ReactNode;
}) {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAppState();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  return (
    <div className={classes.root}>
      <PendingWrite />
      <AppBar position="fixed" color="default" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Link href={previousPage ?? '/'}>
            {showNav ? (
              <Typography className={classes.title} variant="h2">
                AOMNI
              </Typography>
            ) : (
              <IconButton>
                <BackIcon />
              </IconButton>
            )}
          </Link>
          <div className={classes.toolbarContent}></div>
          <div className={classes.rightButtonContainer}>
            <Typography className={classes.displayName} variant="h4">
              {user?.displayName}
            </Typography>
            <Menu />
          </div>
        </Toolbar>
      </AppBar>

      {showNav && <Nav mobileOpen={mobileOpen} toggleOpen={handleDrawerToggle} />}

      <main className={classes.main}>
        <div className={classes.toolbarSpacer} />
        <div className={classes.content}>{children}</div>
      </main>
    </div>
  );
}
