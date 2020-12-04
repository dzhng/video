import React, { useEffect, useState } from 'react';
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
  const [field, meta, helpers] = useField({
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
      <TextField
        multiline={true}
        defaultValue={value.text}
        onChange={(e) => setValue({ text: e.target.value })}
      />
    </Paper>
  );
}
