import React, { useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      '& .MuiDialog-paper': theme.customMixins.modalPaper,
      '& .MuiDialogContent-root': {
        paddingBottom: theme.spacing(3),
      },
    },
  }),
);

export default function ConfirmStartModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose(): void;
  onConfirm(): void;
}) {
  const classes = useStyles();

  const handleSubmit = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  return (
    <Dialog className={classes.modal} open={open} onClose={onClose}>
      <DialogTitle disableTypography>
        <Typography variant="h2">Start new activity?</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1">
          Starting a new activity will pause the current activity. You can resume the current
          activity any time.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button type="submit" color="primary" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" color="primary" variant="contained" autoFocus onClick={handleSubmit}>
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
}
