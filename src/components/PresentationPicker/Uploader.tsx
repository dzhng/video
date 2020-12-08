import React, { useState, useCallback, ChangeEvent } from 'react';
import { trim, truncate } from 'lodash';
import clsx from 'clsx';
import { Typography, Paper, CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';

import { LocalModel, Presentation } from '~/firebase/schema-types';
import { useAppState } from '~/state';
import useConvert from '~/hooks/useConvert/useConvert';
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

      '&.disabled': {
        cursor: 'default',
      },
    },
  }),
);

export default function Uploader({ setData }: { setData(data: LocalModel<Presentation>): void }) {
  const { convert, isPreparing } = useConvert();
  const { user } = useAppState();
  const classes = useStyles();
  const [isUploading, setIsUploading] = useState(false);

  const disableUpload = isUploading || isPreparing;

  const handleFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;

      if (!user) {
        console.warn('No authenticated user');
        return;
      }

      if (isUploading) {
        console.warn('Already uploading');
        return;
      }

      if (!files || files.length < 1) {
        console.warn('No file was selected');
        return;
      }

      if (!convert) {
        console.warn('Convert API is not ready');
        return;
      }

      setIsUploading(true);
      const file = files[0];
      console.log(file);

      const convertResult = await convert('pdf', 'png', file);
      console.log(convertResult);

      /*
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

      const data: Presentation = {
        name: truncate(trim(file.name), { length: 50 }) ?? 'New Presentation',
        creatorId: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await doc.set(data);

      setData({ id: doc.id, ...data });*/
      setIsUploading(false);
    },
    [user, isUploading, setData, convert],
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
        disabled={disableUpload}
        onChange={handleFile}
      />
      <label htmlFor="contained-button">
        <Paper
          className={clsx(classes.pickerPaper, {
            disabled: disableUpload,
          })}
          elevation={0}
          variant="outlined"
        >
          {disableUpload ? (
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
