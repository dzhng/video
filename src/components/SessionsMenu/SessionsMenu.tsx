import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Grid, IconButton, Tooltip, Divider, Button, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  MoreVert as SettingsIcon,
  HistoryOutlined as HistoryIcon,
  RssFeed as ShareIcon,
} from '@material-ui/icons';
import { useSnackbar } from 'notistack';

import { ROOT_URL } from '~/constants';
import { VideoCallFilledIcon } from '~/components/Icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
      paddingRight: theme.spacing(1),
      display: 'flex',
      justifyContent: 'flex-end',
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
      width: '50%',
      maxWidth: 400,
      flexGrow: 1,
    },
    callButton: {
      ...theme.customMixins.callButton,
      height: 60,

      '& svg': {
        marginRight: theme.spacing(1),
      },
    },
    addButton: {
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
  }),
);

function updateClipboard(newClip: string) {
  navigator.clipboard.writeText(newClip).then(
    function () {
      console.log('Copy successful!');
    },
    function (e) {
      console.warn('Copy failed!', e);
    },
  );
}

export default function SessionsMenu() {
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const templateId = String(router.query.slug);
  const relativeCallLink = `/start/${templateId}`;
  const sharableCallLink = `${ROOT_URL}${relativeCallLink}`;
  // for the start call button, include from param to go back to this page
  const callHref = `${relativeCallLink}?from=${encodeURIComponent(`/template/${templateId}`)}`;

  const handleShare = useCallback(() => {
    updateClipboard(sharableCallLink);
    enqueueSnackbar('URL copied to clipboard!');
  }, [sharableCallLink, enqueueSnackbar]);

  return (
    <div className={classes.container}>
      <div className={classes.toolbar}>
        <Tooltip title="Previous sessions" placement="bottom">
          <IconButton>
            <HistoryIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Template settings" placement="bottom">
          <IconButton>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </div>

      <div className={classes.content}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Link href={callHref}>
              <Button
                fullWidth
                color="secondary"
                variant="contained"
                className={classes.callButton}
              >
                <VideoCallFilledIcon /> Start Call
              </Button>
            </Link>
          </Grid>

          <Divider className={classes.divider} />

          <Grid item xs={12} className={classes.sharePanel}>
            <TextField
              value={sharableCallLink}
              variant="outlined"
              size="small"
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                e.target.setSelectionRange(0, 100);
                handleShare();
              }}
            />
            <Tooltip title="Copy link to clipboard" placement="bottom">
              <Button
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
    </div>
  );
}
