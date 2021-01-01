import React, { forwardRef, useState, useCallback } from 'react';
import {
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { LocalModel, User } from '~/firebase/schema-types';
import MembersField from './MembersField';

interface PropTypes {
  members: LocalModel<User>[];
  addMembers(emails: string[]): Promise<void>;
  removeMembers(ids: string[]): Promise<void>;
  onClick(): void;
  className?: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    dialogContent: {
      paddingTop: 0,
    },
  }),
);

export default forwardRef(function AddMemberMenuItem(
  { addMembers, removeMembers, members, onClick, className }: PropTypes,
  ref,
) {
  const [formOpen, setFormOpen] = useState(false);
  const [removedUsers, setRemovedUsers] = useState<LocalModel<User>[]>([]);
  const [addedEmails, setAddedEmails] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const classes = useStyles();

  const handleClick = useCallback(() => {
    setFormOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    // don't allow cancel while you are submitting
    if (isSubmitting) {
      return;
    }

    setFormOpen(false);
    onClick();
  }, [isSubmitting, onClick]);

  const handleMembersChange = useCallback(
    (_addedEmails: string[], _removedUsers: LocalModel<User>[]) => {
      setRemovedUsers(_removedUsers);
      setAddedEmails(_addedEmails);
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    if (removedUsers.length > 0) {
      await removeMembers(removedUsers.map((u) => u.id));
    }

    if (addedEmails.length > 0) {
      await addMembers(addedEmails);
    }

    setIsSubmitting(false);
    setFormOpen(false);
    onClick();
  }, [isSubmitting, onClick, removeMembers, addMembers, removedUsers, addedEmails]);

  return (
    <>
      <MenuItem
        ref={ref as React.RefObject<HTMLLIElement>}
        className={className}
        onClick={handleClick}
      >
        Manage Workspace Members
      </MenuItem>
      <Dialog
        open={formOpen}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Manage Workspace Members</DialogTitle>

        <DialogContent className={classes.dialogContent}>
          <DialogContentText>
            Workspace members will be able to access all content in this workspace. We will send
            them an invite email to new members to register for Aomni.
          </DialogContentText>
          <MembersField users={members} onChange={handleMembersChange} />
        </DialogContent>
        <DialogActions>
          <Button disabled={isSubmitting} onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            disabled={isSubmitting}
            autoFocus
            onClick={handleSubmit}
          >
            {isSubmitting ? <CircularProgress color="inherit" size={'1.5rem'} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
