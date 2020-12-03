import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { uniq, compact } from 'lodash';
import { Typography, Grid, Button, LinearProgress, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import { Call } from '~/firebase/schema-types';
import PresentationPicker from '~/components/PresentationPicker/PresentationPicker';
import NotesEditor from '~/components/NotesEditor/NotesEditor';
import InfoBar from './InfoBar';
import EmailsField from './EmailsField';

interface PropTypes {
  call?: Call;
  saveCall(values: Call): void;
}

const CallSchema = Yup.object().shape({
  name: Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required(),
  guestEmails: Yup.array().of(Yup.string().email('You must provide a valid email')),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(3),
    },
  }),
);

const LeftColumn = ({
  isSubmitting,
  submitForm,
}: {
  isSubmitting: boolean;
  submitForm(): Promise<any>;
}) => {
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
        <PresentationPicker />
      </Grid>

      <Grid item xs={6}>
        <NotesEditor />
      </Grid>

      <Grid item xs={12}>
        {isSubmitting && <LinearProgress />}
        <Button variant="contained" color="primary" disabled={isSubmitting} onClick={submitForm}>
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

const RightColumn = ({ values }: { values: Call }) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Typography variant="h6">Invite Guests</Typography>
          <EmailsField name="guestEmails" values={values.guestEmails ?? []} />
        </Paper>
      </Grid>
    </Grid>
  );
};

const CallForm = ({
  values,
  isSubmitting,
  submitForm,
}: {
  values: Call;
  isSubmitting: boolean;
  submitForm(): Promise<any>;
}) => (
  <Grid container spacing={3}>
    <Grid item xs={9}>
      <LeftColumn isSubmitting={isSubmitting} submitForm={submitForm} />
    </Grid>
    <Grid item xs={3}>
      <RightColumn values={values} />
    </Grid>
  </Grid>
);

export default function EditContainer({ call, saveCall }: PropTypes) {
  const isCreating = Boolean(!call);

  const initialValues = {
    name: call?.name ?? '',
    state: call?.state ?? 'pre',
    users: call?.users ?? [],
    guestEmails: call?.guestEmails ?? [],
    createdAt: call?.createdAt ?? new Date(),
  };

  const submitCall = useCallback(
    (values: Call, { setSubmitting }) => {
      // clean up any empty emails
      const cleanedEmails = uniq(compact(values.guestEmails));

      saveCall({
        ...values,
        guestEmails: cleanedEmails,
      });

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
          {({ values, submitForm, isSubmitting }) => (
            <Form>
              <CallForm values={values} submitForm={submitForm} isSubmitting={isSubmitting} />
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}
