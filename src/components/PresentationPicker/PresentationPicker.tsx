import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Paper, CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useField } from 'formik';

import { LocalModel, Presentation } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import Uploader from './Uploader';
import Preview from './Preview';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(3),
    },
  }),
);

export default function PresentationPicker({ name }: { name: string }) {
  const classes = useStyles();
  const [field, , helpers] = useField({
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
  }, [value]);

  const setData = useCallback(
    (data: LocalModel<Presentation> | null) => {
      if (data) {
        setPresentationData(data);
        setValue(data.id);
      } else {
        setPresentationData(null);
        setValue(undefined);
      }
    },
    [setValue],
  );

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6">Presentation</Typography>
      <Typography variant="body2">
        Upload the presentation to be used in this call. We support PDF or Powerpoint formats.
      </Typography>
      {isQueryingOrCreating && <CircularProgress />}
      {!presentationData && !isQueryingOrCreating && <Uploader setData={setData} />}

      {presentationData && <Preview data={presentationData} />}
    </Paper>
  );
}
