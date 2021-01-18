import React, { useCallback, useState, useMemo } from 'react';
import Link from 'next/link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden,
  Divider,
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
import { VideoCallIcon } from '~/components/Icons';
import { isBrowser } from '~/utils';
import { useAppState } from '~/state';
import Menu from './Menu/Menu';

const NewWorkspaceValue = '__New_Workspace__';
const sidebarWidth = 300;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: sidebarWidth,
        flexShrink: 0,
      },
    },
    select: {
      // subtract an extra 2 for the border
      width: sidebarWidth - theme.spacing(2) * 2 - 2,
      margin: theme.spacing(2),
    },
    createWorkspaceItem: {
      color: theme.palette.primary.main,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    drawerPaper: {
      width: sidebarWidth,
    },
    list: {
      '& .MuiListItemIcon-root': {
        minWidth: 40,
        color: theme.palette.secondary.main,
      },
    },
    drawerContent: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    drawerContentFooter: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    profileMenu: {
      display: 'flex',
      alignItems: 'stretch',
      padding: theme.spacing(1),

      '& .MuiTypography-root': {
        marginTop: 'auto',
        marginBottom: 'auto',
      },
    },
    displayName: {
      textAlign: 'right',
    },
    title: {
      padding: theme.spacing(3),
    },
    divider: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  }),
);

export default function Nav({
  mobileOpen,
  closeModal,
}: {
  mobileOpen: boolean;
  closeModal(): void;
}) {
  const classes = useStyles();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const {
    userRecord,
    workspaces,
    isWorkspacesReady,
    currentWorkspaceId,
    setCurrentWorkspaceId,
    createWorkspace,
  } = useAppState();

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
    closeModal();
  }, [newWorkspaceName, createWorkspace, closeModal]);

  const drawer = useMemo(
    () => (
      <div className={classes.drawerContent}>
        <Typography className={classes.title} variant="h2">
          AOMNI
        </Typography>

        <Divider className={classes.divider} />

        <List className={classes.list}>
          <Link href="/">
            <ListItem button onClick={closeModal}>
              <ListItemIcon>
                <VideoCallIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="h3">Templates</Typography>
              </ListItemText>
            </ListItem>
          </Link>
        </List>

        <div className={classes.drawerContentFooter}>
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
                  <Typography variant="h5" className={classes.createWorkspaceItem}>
                    <b>+ New Workspace</b>
                  </Typography>
                </MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Skeleton variant="rect" height={45} className={classes.select} />
          )}

          <Divider className={classes.divider} />

          <div className={classes.profileMenu}>
            <Menu />
            <Typography className={classes.displayName} variant="h2">
              {userRecord?.displayName}
            </Typography>
          </div>
        </div>
      </div>
    ),
    [
      classes,
      currentWorkspaceId,
      handleWorkspaceChange,
      isWorkspacesReady,
      workspaces,
      userRecord,
      closeModal,
    ],
  );

  const createWorkspaceModal = useMemo(
    () => (
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
    ),
    [handleCreateWorkspace, isCreatingWorkspace, newWorkspaceName],
  );

  const container = isBrowser ? () => window.document.body : undefined;

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      {createWorkspaceModal}

      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={closeModal}
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
  );
}
