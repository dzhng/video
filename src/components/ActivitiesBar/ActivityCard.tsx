import React from 'react';
import { Card, Typography, IconButton } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { MoreVert as MoreIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(2),
      cursor: 'pointer',

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
        boxShadow: theme.shadows[4],
      },
    },
    activityType: {
      color: theme.palette.grey[600],
    },
    content: {
      flexGrow: 1,
    },
  }),
);

export default function ActivitiesCard() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <div className={classes.content}>
        <Typography variant="h2">Activity name</Typography>
        <Typography variant="body1" className={classes.activityType}>
          presentation
        </Typography>
      </div>
      <div>
        <IconButton>
          <MoreIcon />
        </IconButton>
      </div>
    </Card>
  );
}
