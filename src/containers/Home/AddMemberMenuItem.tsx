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
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import { LocalModel, User } from '~/firebase/schema-types';
import EmailsField from './EmailsField';

interface PropTypes {
  members: LocalModel<User>[];
  addMember(email: string): void;
  removeMember(id: string): void;
  onClick(): void;
  className?: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    dialogContent: {
      paddingTop: 0,
    },
  }),
);

export default forwardRef(function AddMemberMenuItem(
  { addMember, removeMember, members, onClick, className }: PropTypes,
  ref,
) {
  const [formOpen, setFormOpen] = useState(false);
  const classes = useStyles();

  const handleClick = useCallback(() => {
    setFormOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setFormOpen(false);
    onClick();
  }, [onClick]);

  const handleSubmit = useCallback(
    (values) => {
      const emails = values.emails;
      console.log(emails);
      setFormOpen(false);
      onClick();
    },
    [onClick],
  );

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

        <Formik
          initialValues={{ emails: members.map((member) => member.email ?? '') }}
          onSubmit={handleSubmit}
          validate={() => {}}
        >
          {({ values }) => (
            <Form>
              <DialogContent className={classes.dialogContent}>
                <DialogContentText>
                  Workspace members will be able to access all content in this workspace. We will
                  send them an invite email to new members to register for Aomni.
                </DialogContentText>
                <EmailsField name="emails" values={values.emails} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancel} color="primary">
                  Cancel
                </Button>
                <Button color="primary" autoFocus type="submit">
                  Add
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
});
