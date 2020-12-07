import React, { useState, useCallback } from 'react';
import { trim, truncate } from 'lodash';
import { Typography, Paper, CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';

import { Presentation } from '~/firebase/schema-types';
import { useAppState } from '~/state';
import firebase, { db, storage } from '~/utils/firebase';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

export default function Uploader({ setData }: { setData(data: Presentation): void }) {
  const { user } = useAppState();
  const classes = useStyles();
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = useCallback(
    async (e) => {
      const { files } = e.target;

      if (!user) {
        console.warn('No authenticated user');
        return;
      }

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
      const metadata = {
        customMetadata: {
          originalName: file.name,
        },
      };

      // first create a presentation doc
      const doc = db.collection('presentations').doc();

      // use the doc id as the filename
      const ref = storage.ref(`presentations/${doc.id}`);
      await ref.put(file, metadata);

      await doc.set({
        name: truncate(trim(file.name), { length: 50 }) ?? 'New Presentation',
        creatorId: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      } as Presentation);

      setIsUploading(false);
    },
    [user, isUploading],
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
}
