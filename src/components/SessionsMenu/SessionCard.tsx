import React from 'react';
import { Card, Typography, Button, IconButton, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DeleteOutlined as DeleteIcon, RssFeed as ShareIcon } from '@material-ui/icons';
import { VideoCallFilledIcon } from '~/components/Icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
      padding: theme.spacing(2),
    },
    content: {
      flexGrow: 1,

      '& h2': {
        lineHeight: '36px',
      },
    },
    callButton: {
      ...theme.customMixins.callButton,
      marginLeft: theme.spacing(1),
    },
    actionButton: {
      marginRight: theme.spacing(1),
      width: 36,
      height: 36,
      minWidth: 0,
      padding: 0,
      borderRadius: 18,
    },
  }),
);

export default function SessionCard() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <div className={classes.content}>
        <Typography variant="h2">Session name</Typography>
      </div>

      <Tooltip title="Delete" placement="bottom">
        <Button color="secondary" variant="outlined" className={classes.actionButton}>
          <DeleteIcon />
        </Button>
      </Tooltip>

      <Tooltip title="Share" placement="bottom">
        <Button color="secondary" variant="outlined" className={classes.actionButton}>
          <ShareIcon />
        </Button>
      </Tooltip>

      <Tooltip title="Start call" placement="bottom">
        <Button variant="contained" color="secondary" className={classes.callButton}>
          <VideoCallFilledIcon />
        </Button>
      </Tooltip>
    </Card>
  );
}
