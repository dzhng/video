import React, { useEffect, useState } from 'react';
import { Typography, Paper, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useField } from 'formik';
import { Note } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';

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
  const [note, setNote] = useState<Note | null>(null);
  const [isQueryingOrCreating, setIsQueryingOrCreating] = useState(true);

  const { value } = field;
  const { setValue } = helpers;

  useEffect(() => {
    setIsQueryingOrCreating(true);

    const queryNote = async (noteId: string) => {
      const doc = await db.collection('notes').doc(noteId).get();
      if (doc.exists) {
        setNote(doc.data() as Note);
        setIsQueryingOrCreating(false);
      } else {
        // if cannot find doc, create a new note (this should not happen)
        console.error('ERROR: cannot find note doc for call');
        await createNote();
      }
    };

    const createNote = async () => {
      const doc = await db.collection('notes').add({ text: '' });

      setIsQueryingOrCreating(false);
    };

    // get note if it exist, or create a new doc
    if (value) {
      queryNote(value);
    } else {
    }
  }, [value]);

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6">Notes</Typography>
      <TextField multiline={true} defaultValue={note?.text} />
    </Paper>
  );
}
