import React, { useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Grid,
  IconButton,
  Tooltip,
  Divider,
  Button,
  TextField,
  Menu,
  MenuItem,
  Hidden,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  MoreVert as SettingsIcon,
  HistoryOutlined as HistoryIcon,
  RssFeed as ShareIcon,
  Menu as MenuIcon,
} from '@material-ui/icons';
import { useSnackbar } from 'notistack';

import { VideoCallFilledIcon } from '~/components/Icons';
import { Collections } from '~/firebase/schema-types';
import { isBrowser, updateClipboard } from '~/utils';
import { db } from '~/utils/firebase';
import DeleteMenuItem from './DeleteMenuItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      display: 'flex',
      justifyContent: 'space-between',

      '& >div:first-child': {
        flexGrow: 1,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    content: {
      display: 'flex',
      alignSelf: 'center',
      alignItems: 'center',
      width: '90%',
      maxWidth: 400,
      flexGrow: 1,
      // shift things up a bit to make up for toolbar height
      marginBottom: 60,

      '& a': {
        textDecoration: 'none',
      },
    },
    callButton: {
      ...theme.customMixins.callButton,
      height: 60,

      '& svg': {
        marginRight: theme.spacing(1),
      },
    },
    addButton: {
      [theme.breakpoints.up('sm')]: {
        width: 110,
        flexShrink: 0,
      },

      '& svg': {
        marginRight: 2,
      },
    },
    divider: {
      width: '96%',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    sharePanel: {
      display: 'flex',
      alignItems: 'stretch',

      '& .MuiTextField-root': {
        flexGrow: 1,
        backgroundColor: theme.palette.grey[100],

        '& input': {
          color: theme.palette.grey[700],
        },
      },

      '& button': {
        marginLeft: theme.spacing(1),
      },
    },
    deleteButtonMenu: {
      color: theme.palette.error.main,
    },
  }),
);

export default function SessionsMenu({ openDrawer }: { openDrawer(): void }) {
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // settings menu
  const anchorRef = useRef<HTMLDivElement>(null);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const location = isBrowser ? window.location : ({} as Location);

  const templateId = String(router.query.slug);
  const relativeCallLink = `/start/${templateId}`;

  const sharableCallLink = `${location.protocol}//${location.host}${relativeCallLink}`;

  // for the start call button, include from param to go back to this page
  const callHref = `${relativeCallLink}?from=${encodeURIComponent(`/template/${templateId}`)}`;

  const handleShare = useCallback(() => {
    updateClipboard(sharableCallLink);
    enqueueSnackbar('URL copied to clipboard!');
  }, [sharableCallLink, enqueueSnackbar]);

  const handleDeleteTemplate = useCallback(() => {
    if (templateId) {
      db.collection(Collections.TEMPLATES).doc(templateId).update({
        isDeleted: true,
      });

      // route to home when done
      router.replace('/');
    }
  }, [templateId, router]);

  return (
    <div className={classes.container}>
      <div className={classes.toolbar}>
        <div>
          <Hidden smUp implementation="css">
            <IconButton onClick={openDrawer}>
              <MenuIcon />
            </IconButton>
          </Hidden>
        </div>

        <Tooltip title="Previous sessions (Coming soon!)" placement="bottom">
          <div>
            <IconButton disabled>
              <HistoryIcon />
            </IconButton>
          </div>
        </Tooltip>
        <Tooltip title="Room settings" placement="bottom">
          <div ref={anchorRef}>
            <IconButton onClick={() => setSettingsMenuOpen((state) => !state)}>
              <SettingsIcon />
            </IconButton>
          </div>
        </Tooltip>
      </div>

      <div className={classes.content}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <a href={callHref}>
              <Button
                fullWidth
                color="secondary"
                variant="contained"
                className={classes.callButton}
              >
                <VideoCallFilledIcon /> Start Call
              </Button>
            </a>
          </Grid>

          <Divider className={classes.divider} />

          <Grid item xs={12} className={classes.sharePanel}>
            <Hidden xsDown implementation="js">
              <TextField
                value={sharableCallLink}
                variant="outlined"
                size="small"
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                  e.target.setSelectionRange(0, 100);
                  handleShare();
                }}
              />
            </Hidden>
            <Tooltip title="Copy link to clipboard" placement="bottom">
              <Button
                fullWidth
                color="secondary"
                variant="outlined"
                className={classes.addButton}
                onClick={handleShare}
              >
                <ShareIcon /> Share
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </div>

      <Menu
        open={settingsMenuOpen}
        onClose={() => setSettingsMenuOpen((state) => !state)}
        anchorEl={anchorRef.current}
      >
        <MenuItem disabled>Settings</MenuItem>
        <DeleteMenuItem
          deleteTemplate={handleDeleteTemplate}
          onClick={() => setSettingsMenuOpen(false)}
          className={classes.deleteButtonMenu}
        />
      </Menu>
    </div>
  );
}
