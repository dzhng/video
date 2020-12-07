import React from 'react';
import { Typography, Paper, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useField } from 'formik';
import { Note } from '~/firebase/schema-types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(3),
    },
  }),
);

export default function NotesEditor({ name }: { name: string }) {
  const classes = useStyles();
  const [field, , helpers] = useField({
    name,
    type: 'text',
    multiple: false,
  });

  // value is the note data
  const { value }: { value: Note } = field;
  const { setValue } = helpers;

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6">Notes</Typography>
      <Typography variant="body2">
        Notes will be shared with all attendees in the call, during the call itself, after the call,
        as well as in the calendar invite. All attendees can edit the notes.
      </Typography>
      <TextField
        fullWidth
        multiline={true}
        variant="outlined"
        rows={5}
        rowsMax={20}
        margin="normal"
        placeholder="Leave any notes for the call here..."
        defaultValue={value.text}
        onChange={(e) => setValue({ text: e.target.value })}
      />
    </Paper>
  );
}
