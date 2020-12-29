import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, Grid, Card, Typography } from '@material-ui/core';
import { RecentActorsOutlined as PresentIcon } from '@material-ui/icons';
import { Activity } from '~/firebase/schema-types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      '& .MuiDialog-paper': {
        width: '50%',
        maxWidth: theme.modalWidth,
      },
      '& .MuiDialogContent-root': {
        paddingBottom: theme.spacing(3),
      },
    },
    card: {
      cursor: 'pointer',
      padding: theme.spacing(2),
      display: 'flex',
      height: 150,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[5],
      transition: theme.transitionTime,

      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: theme.shadows[12],
      },

      '& h2': {
        marginBottom: theme.spacing(1),
        fontWeight: 600,
        color: 'white',
        letterSpacing: 0,
      },
    },
    icon: {
      fontSize: '3rem',
      color: 'white',
    },
  }),
);

export default function NewActivityModal({
  onNewActivity,
  open,
  onClose,
}: {
  onNewActivity(newActivity: Activity): void;
  open: boolean;
  onClose(): void;
}) {
  const classes = useStyles();

  const activityTypes: { type: string; name: string; icon: JSX.Element }[] = [
    { type: 'presentation', name: 'Presentation', icon: <PresentIcon className={classes.icon} /> },
  ];

  return (
    <Dialog className={classes.modal} open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h2">New Activity</Typography>
      </DialogTitle>

      <DialogContent>
        <Grid container>
          {activityTypes.map((type) => (
            <Grid item xs={3}>
              <Card className={classes.card}>
                <Typography variant="h2">{type.name}</Typography>
                {type.icon}
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
