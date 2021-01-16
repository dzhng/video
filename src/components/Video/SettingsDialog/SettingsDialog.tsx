import React from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { DeviceSelector } from './DeviceSelector/DeviceSelector';

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      ...theme.customMixins.modalPaper,
    },
    content: {
      borderTop: theme.dividerBorder,
      borderBottom: theme.dividerBorder,
    },
  }),
);

export default function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
      <DialogTitle>
        <Typography variant="h2">
          <b>Select Camera or Mic</b>
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <DeviceSelector />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
