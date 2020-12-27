import React, { useCallback } from 'react';
import {
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Paper,
  InputBase,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { VideoCall, AddOutlined as AddIcon } from '@material-ui/icons';
import SessionCard from './SessionCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      maxWidth: 500,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 60,
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
    <div className={classes.container}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Button fullWidth color="secondary" variant="contained" className={classes.callButton}>
            <VideoCall /> Start Call
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
  );
}
