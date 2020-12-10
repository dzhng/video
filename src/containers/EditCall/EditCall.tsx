import React, { useCallback } from 'react';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { uniq, compact } from 'lodash';
import {
  Typography,
  Grid,
  Button,
  CircularProgress,
  Paper,
  InputAdornment,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import { Call, Note } from '~/firebase/schema-types';
import PresentationPicker from '~/components/PresentationPicker/PresentationPicker';
import NotesEditor from '~/components/NotesEditor/NotesEditor';
import InfoBar from './InfoBar';
import EmailsField from './EmailsField';

interface PropTypes {
  callId?: string;
  call?: Call;
  saveCall(call: Call, note: Note): void;
  note?: Note;
}

const CallSchema = Yup.object().shape({
  name: Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required(),
  guestEmails: Yup.array().of(Yup.string().email('You must provide a valid email')),
  startTime: Yup.date().nullable().required(),
  durationMin: Yup.number().nullable().required(),
  note: Yup.object().shape({
    text: Yup.string().max(50000),
  }),
  presentationId: Yup.string().nullable(),
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

const InfoFields = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6">Call Info</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
        </Grid>

        <Grid item xs={6}>
          <Field
            component={TextField}
            name="startTime"
            type="datetime-local"
            label="Start Time"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <Field
            component={TextField}
            name="durationMin"
            type="number"
            label="Call Duration"
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">Minutes</InputAdornment>,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const LeftColumn = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <InfoFields />
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
        <Button
          fullWidth
          className={classes.submitButton}
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress /> : 'Save'}
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

export default function EditContainer({ callId, call, saveCall, note }: PropTypes) {
  const isCreating = Boolean(!call);

  const defaultNoteData = {
    text: '',
  };

  // default start time is tomorrow same time
  const defaultStartTime = dayjs(Date.now() + 24 * 3600 * 1000).format('YYYY-MM-DDTHH:mm');

  // A lot of these values are not editable in the UI, but we initialize them anyways with existing or default values so that we get nice typescript checking via the Presentation model. Maybe there's a better way to do this in the future that's cleaner and still get same type checking.
  const initialValues = {
    name: call?.name ?? '',
    state: call?.state ?? 'pre',
    creatorId: call?.creatorId ?? '', // here purely to satisfy Call type
    users: call?.users ?? [],
    guestEmails: call?.guestEmails ?? [],
    startTime: call?.startTime ?? defaultStartTime,
    durationMin: call?.durationMin ?? 60,
    presentationId: call?.presentationId ?? null,
    note: note ?? defaultNoteData,
    createdAt: call?.createdAt ?? new Date(),
  };

  const submitCall = useCallback(
    (values: Call & { note: Note }, { setSubmitting }) => {
      const { note: noteData, startTime, ...callData } = values;

      // clean up any empty emails
      const cleanedEmails = uniq(compact(callData.guestEmails));

      // start time needs to be explicitly transformed into date since it arrives as string
      const cleanedStartTime = typeof startTime === 'string' ? new Date(startTime) : startTime;

      saveCall(
        {
          ...callData,
          guestEmails: cleanedEmails,
          startTime: cleanedStartTime,
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
        {!isCreating && call && callId && <InfoBar callId={callId} call={call} />}
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
