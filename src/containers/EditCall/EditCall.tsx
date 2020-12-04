import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { uniq, compact } from 'lodash';
import { Typography, Grid, Button, LinearProgress, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import { Call, Note } from '~/firebase/schema-types';
import PresentationPicker from '~/components/PresentationPicker/PresentationPicker';
import NotesEditor from '~/components/NotesEditor/NotesEditor';
import InfoBar from './InfoBar';
import EmailsField from './EmailsField';

interface PropTypes {
  call?: Call;
  saveCall(call: Call, note: Note): void;
  note?: Note;
}

const CallSchema = Yup.object().shape({
  name: Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required(),
  guestEmails: Yup.array().of(Yup.string().email('You must provide a valid email')),
  note: Yup.object().shape({
    text: Yup.string().max(50000),
  }),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(3),
    },
    submitButton: {
      marginTop: theme.spacing(3),
    },
  }),
);

const LeftColumn = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Typography variant="h6">Call Info</Typography>
          <Field
            component={TextField}
            name="name"
            type="text"
            label="Name"
            placeholder="What is this call about?"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <PresentationPicker name="presentationId" />
      </Grid>

      <Grid item xs={6}>
        <NotesEditor name="note" />
      </Grid>
    </Grid>
  );
};

const RightColumn = ({ values, isSubmitting }: { values: Call; isSubmitting: boolean }) => {
  const classes = useStyles();
  const fieldName = 'guestEmails';

  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Typography variant="h6">Invite Guests</Typography>
          <EmailsField name={fieldName} values={values[fieldName] ?? []} />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        {isSubmitting && <LinearProgress />}
        <Button
          fullWidth
          className={classes.submitButton}
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

const CallForm = ({ values, isSubmitting }: { values: Call; isSubmitting: boolean }) => (
  <Grid container spacing={3}>
    <Grid item xs={9}>
      <LeftColumn />
    </Grid>
    <Grid item xs={3}>
      <RightColumn values={values} isSubmitting={isSubmitting} />
    </Grid>
  </Grid>
);

export default function EditContainer({ call, saveCall, note }: PropTypes) {
  const isCreating = Boolean(!call);

  const defaultNoteData = {
    text: '',
  };

  const initialValues = {
    name: call?.name ?? '',
    state: call?.state ?? 'pre',
    users: call?.users ?? [],
    guestEmails: call?.guestEmails ?? [],
    note: note ?? defaultNoteData,
    createdAt: call?.createdAt ?? new Date(),
  };

  const submitCall = useCallback(
    (values: Call & { note: Note }, { setSubmitting }) => {
      const { note: noteData, ...callData } = values;

      // clean up any empty emails
      const cleanedEmails = uniq(compact(callData.guestEmails));

      saveCall(
        {
          ...callData,
          guestEmails: cleanedEmails,
        },
        noteData,
      );

      setSubmitting(false);
    },
    [saveCall],
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        {!isCreating && call && <InfoBar call={call} />}
      </Grid>

      <Grid item xs={12}>
        <Formik initialValues={initialValues} validationSchema={CallSchema} onSubmit={submitCall}>
          {({ values, isSubmitting }) => (
            <Form>
              <CallForm values={values} isSubmitting={isSubmitting} />
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}
