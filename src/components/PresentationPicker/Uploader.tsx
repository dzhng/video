import React, { useState, useCallback, ChangeEvent } from 'react';
import { trim, truncate } from 'lodash';
import clsx from 'clsx';
import { Typography, Paper, CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';

import { Collections, Presentation } from '~/firebase/schema-types';
import { useAppState } from '~/state';
import useConvert, { fromType } from '~/hooks/useConvert/useConvert';
import firebase, { db } from '~/utils/firebase';

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

export default function Uploader({ setData }: { setData(id: string, data: Presentation): void }) {
  const { convert, isPreparing } = useConvert();
  const { user, currentWorkspaceId } = useAppState();
  const classes = useStyles();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disableUpload = isUploading || isPreparing;

  const handleFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;

      if (!user || !currentWorkspaceId) {
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

      setError(null);
      setIsUploading(true);

      const file = files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();

      let fileType: fromType | null = null;
      if (file.type === 'application/pdf' || ext === 'pdf') {
        fileType = 'pdf';
      } else if (file.type === 'application/vnd.ms-powerpoint' || ext === '.ppt') {
        fileType = 'ppt';
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        ext === '.pptx'
      ) {
        fileType = 'pptx';
      }

      if (fileType === null) {
        console.warn('Invalid file type uploaded');
        setError('An invalid file type was selected');
        return;
      }

      const convertResult = await convert(fileType, 'png', file);
      if (!convertResult || convertResult.length <= 0) {
        console.warn('Convert result undefined');
        setError('Error processing file, please try another file');
        return;
      }

      const fileUrls = convertResult.map((res) => res.Url);

      const data: Presentation = {
        name: truncate(trim(file.name), { length: 50 }) ?? 'New Presentation',
        workspaceId: currentWorkspaceId,
        creatorId: user.uid,
        isProcessed: false, // mark for processing in cloud function
        slides: fileUrls,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // first create a presentation doc
      const doc = await db.collection(Collections.PRESENTATIONS).add(data);

      setData(doc.id, data);
      setIsUploading(false);
    },
    [user, currentWorkspaceId, isUploading, setData, convert],
  );

  // TODO: add a drag/drop uploader here
  return (
    <>
      <Typography variant="body2">
        Upload a presentation for this call. We support either PDF or Powerpoint format.
      </Typography>
      {error && <Typography variant="body2">Error uploading presentation: {error}</Typography>}
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
              <Typography variant="h5">Upload</Typography>
            </>
          )}
        </Paper>
      </label>
    </>
  );
}
