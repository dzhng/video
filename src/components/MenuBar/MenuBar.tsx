import React, { useState } from 'react';
import Link from 'next/link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { VideoCall as VideoCallIcon, PresentToAll as PresentIcon } from '@material-ui/icons';
import {
  Typography,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden,
  Drawer,
} from '@material-ui/core';

import { isBrowser } from '~/utils';
import { useAppState } from '~/state';
import PendingWrite from '~/components/PendingWrite/PendingWrite';
import Menu from './Menu/Menu';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    drawerPaper: {
      width: drawerWidth,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAppState();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        <Link href="/">
          <ListItem button>
            <ListItemIcon>
              <VideoCallIcon />
            </ListItemIcon>
            <ListItemText primary="Templates" />
          </ListItem>
        </Link>

        <Link href="/collaterals">
          <ListItem button>
            <ListItemIcon>
              <PresentIcon />
            </ListItemIcon>
            <ListItemText primary="Collaterals" />
          </ListItem>
        </Link>
      </List>
    </div>
  );

  const container = isBrowser ? () => window.document.body : undefined;

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
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
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.main}>
        <div className={classes.toolbar} />
        <div className={classes.content}>{children}</div>
      </main>
    </div>
  );
}
