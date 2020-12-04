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

export default function PresentationPicker({ name }: { name: string }) {
  const classes = useStyles();
  const [field, meta, helpers] = useField({
    name,
    type: 'text',
    multiple: false,
  });
  const [noteData, setNoteData] = useState<Note | null>(null);
  const [isQueryingOrCreating, setIsQueryingOrCreating] = useState(true);

  const { value } = field;
  const { setValue } = helpers;

  useEffect(() => {
    setIsQueryingOrCreating(true);

    const queryNote = async (noteId: string) => {
      const doc = await db.collection('notes').doc(noteId).get();
      if (doc.exists) {
        setNoteData(doc.data() as Note);
        setIsQueryingOrCreating(false);
      } else {
        // if cannot find doc, create a new note (this should not happen)
        console.error('ERROR: cannot find note doc for call');
        await createNote();
      }
    };

    const createNote = async () => {
      const data = { text: '' };
      const doc = await db.collection('notes').add(data);

      setValue(doc.id);
      setIsQueryingOrCreating(false);
      setNoteData(data);
    };

    // get note if it exist, or create a new doc
    if (value) {
      queryNote(value);
    } else {
      createNote();
    }
  }, [value, setValue]);

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6">Presentation</Typography>
      <TextField multiline={true} defaultValue={noteData?.text} />
    </Paper>
  );
}
