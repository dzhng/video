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

export default function ConfirmRestartModal({
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
        <Typography variant="h2">Restart activity?</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1">
          Restarting this activity will erase all data that has been submitted.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button type="submit" color="primary" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" color="primary" variant="contained" autoFocus onClick={handleSubmit}>
          Restart
        </Button>
      </DialogActions>
    </Dialog>
  );
}
