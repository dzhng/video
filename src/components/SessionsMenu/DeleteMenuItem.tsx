import React, { forwardRef, useState, useCallback } from 'react';
import {
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@material-ui/core';

interface PropTypes {
  deleteTemplate(): void;
  onClick(): void;
  className?: string;
}

export default forwardRef(function DeleteMenuItem(
  { deleteTemplate, onClick, className }: PropTypes,
  ref,
) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClick = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setConfirmOpen(false);
    onClick();
  }, [onClick]);

  const handleConfirm = useCallback(() => {
    deleteTemplate();
    setConfirmOpen(false);
    onClick();
  }, [onClick, deleteTemplate]);

  return (
    <>
      <MenuItem
        data-testid="delete-room-button"
        ref={ref as React.RefObject<HTMLLIElement>}
        className={className}
        onClick={handleClick}
      >
        Delete Room
      </MenuItem>
      <Dialog
        open={confirmOpen}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Delete Room?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting a room will delete it for all members in its workspace. You will lose all
            activities created in this room, as well as data from past calls.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="cancelButton" onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button
            data-testid="delete-button"
            onClick={handleConfirm}
            color="primary"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
