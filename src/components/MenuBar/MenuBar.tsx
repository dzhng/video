import React, { useCallback, useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { isBrowser } from '~/utils';
import { useAppState } from '~/state';
import PendingWrite from '~/components/PendingWrite/PendingWrite';
import Menu from './Menu/Menu';

const NewWorkspaceValue = '__New_Workspace__';

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
        width: theme.sidebarWidth,
        flexShrink: 0,
      },
    },
    select: {
      width: theme.sidebarWidth - theme.spacing(2) * 2,
      margin: theme.spacing(2),
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    drawerPaper: {
      width: theme.sidebarWidth,
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    title: {
      minWidth: '200px',
      cursor: 'pointer',
    },
    displayName: {
      textAlign: 'right',
      minWidth: '200px',
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
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const {
    user,
    workspaces,
    isWorkspacesReady,
    currentWorkspaceId,
    setCurrentWorkspaceId,
    createWorkspace,
  } = useAppState();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const handleWorkspaceChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const value = event.target.value as string;
      if (value === NewWorkspaceValue) {
        setIsCreatingWorkspace(true);
      } else {
        setCurrentWorkspaceId(value);
      }
    },
    [setCurrentWorkspaceId],
  );

  const handleCreateWorkspace = useCallback(() => {
    setIsCreatingWorkspace(false);
    createWorkspace(newWorkspaceName);
  }, [newWorkspaceName, createWorkspace]);

  const drawer = (
    <div>
      <div className={classes.toolbar} />

      {isWorkspacesReady && workspaces ? (
        <FormControl variant="outlined" className={classes.select}>
          <InputLabel>Workspace</InputLabel>
          <Select
            label="Workspace"
            value={currentWorkspaceId ?? ''}
            onChange={handleWorkspaceChange}
          >
            {workspaces.map((workspace) => (
              <MenuItem key={workspace.id} value={workspace.id}>
                <Typography variant="h4">{workspace.name}</Typography>
              </MenuItem>
            ))}
            <MenuItem value={NewWorkspaceValue}>
              <Typography variant="h4">New Workspace</Typography>
            </MenuItem>
          </Select>
        </FormControl>
      ) : (
        <Skeleton variant="rect" height={45} className={classes.select} />
      )}

      <List>
        <Link href="/">
          <ListItem button>
            <ListItemIcon>
              <VideoCallIcon />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h3">Templates</Typography>
            </ListItemText>
          </ListItem>
        </Link>

        <Link href="/collaterals">
          <ListItem button>
            <ListItemIcon>
              <PresentIcon />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h3">Collatorals</Typography>
            </ListItemText>
          </ListItem>
        </Link>
      </List>
    </div>
  );

  const createWorkspaceModal = (
    <Dialog open={isCreatingWorkspace} onClose={() => setIsCreatingWorkspace(false)}>
      <DialogTitle>Create New Workspace</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A workspace allows you to collaborate with a group of co-workers on calls.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Workspace Name"
          type="text"
          fullWidth
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsCreatingWorkspace(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreateWorkspace} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );

  const container = isBrowser ? () => window.document.body : undefined;

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
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

      {createWorkspaceModal}

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
