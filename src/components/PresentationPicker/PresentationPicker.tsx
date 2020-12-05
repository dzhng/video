import React, { useEffect, useState, useCallback } from 'react';
import { trim, truncate } from 'lodash';
import { Typography, Paper, Fab, CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import { useField } from 'formik';

import { Presentation } from '~/firebase/schema-types';
import firebase, { db, storage } from '~/utils/firebase';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(3),
    },
    uploadSpinner: {
      color: theme.palette.grey[600],
    },
    pickerPaper: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(3),
      backgroundColor: theme.palette.grey[100],
      textAlign: 'center',
      color: theme.palette.grey[600],
      cursor: 'pointer',
    },
  }),
);

const Picker = ({ currentUserId }: { currentUserId: string }) => {
  const classes = useStyles();
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = useCallback(
    async (e) => {
      const { files } = e.target;

      if (isUploading) {
        console.warn('Already uploading');
        return;
      }

      if (files.length < 1) {
        console.warn('No file was selected');
        return;
      }

      setIsUploading(true);

      const file = files[0];
      // first create a presentation doc
      const doc = db.collection('presentations').doc();

      // use the doc id as the filename
      const ref = storage.ref(`presentations/${doc.id}`);
      await ref.put(file);

      await doc.set({
        name: truncate(trim(file.name), { length: 50 }),
        creatorId: currentUserId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setIsUploading(false);
    },
    [currentUserId, isUploading],
  );

  return (
    <>
      <Typography variant="body2">
        Upload a presentation for this call. We support either PDF or Powerpoint format.
      </Typography>
      <input
        style={{ display: 'none' }}
        id="contained-button"
        type="file"
        accept=".pdf,.ppt,.pptx"
        onChange={handleFile}
      />
      <label htmlFor="contained-button">
        <Paper className={classes.pickerPaper} elevation={0} variant="outlined">
          {isUploading ? (
            <CircularProgress size={50} className={classes.uploadSpinner} />
          ) : (
            <>
              <Add />
              <Typography variant="body2">Upload</Typography>
            </>
          )}
        </Paper>
      </label>
    </>
  );
};

export default function PresentationPicker({
  name,
  currentUserId,
}: {
  name: string;
  currentUserId: string;
}) {
  const classes = useStyles();
  const [field, meta, helpers] = useField({
    name,
    type: 'text',
    multiple: false,
  });
  const [isQueryingOrCreating, setIsQueryingOrCreating] = useState(true);
  const [presentationData, setPresentationData] = useState<Presentation | null>(null);

  const { value } = field;
  const { setValue } = helpers;

  useEffect(() => {
    const query = async (presentationId: string) => {
      const doc = await db.collection('presentations').doc(presentationId).get();
      if (doc.exists) {
        setPresentationData(doc.data() as Presentation);
        setIsQueryingOrCreating(false);
      }
    };

    if (value) {
      setIsQueryingOrCreating(true);
      query(value);
    } else {
      setIsQueryingOrCreating(false);
    }
  }, [value, setValue]);

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6">Presentation</Typography>
      {isQueryingOrCreating && <CircularProgress />}
      {!presentationData && !isQueryingOrCreating && <Picker currentUserId={currentUserId} />}

      {presentationData && <div>PresentationData</div>}
    </Paper>
  );
}
