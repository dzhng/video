import React, { useCallback } from 'react';
import { Grid, IconButton, Tooltip, Divider, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  VideoCall,
  AddOutlined as AddIcon,
  MoreVert as SettingsIcon,
  HistoryOutlined as HistoryIcon,
} from '@material-ui/icons';
import SessionCard from './SessionCard';

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
      maxWidth: 500,
      marginLeft: 'auto',
      marginRight: 'auto',
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
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  }),
);

export default function SessionsMenu() {
  const classes = useStyles();

  return (
    <>
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

      <div className={classes.container}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Button fullWidth color="secondary" variant="contained" className={classes.callButton}>
              <VideoCall /> Quick Call
            </Button>
          </Grid>

          <Divider className={classes.divider} />

          <Grid item xs={12}>
            <Button fullWidth color="primary" variant="contained" className={classes.addButton}>
              <AddIcon /> New Session
            </Button>
          </Grid>
          <Grid item xs={12}>
            <SessionCard />
          </Grid>
          <Grid item xs={12}>
            <SessionCard />
          </Grid>
          <Grid item xs={12}>
            <SessionCard />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
