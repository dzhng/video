import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { uniq, compact } from 'lodash';
import { Grid, Button, LinearProgress } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import { Call } from '~/firebase/schema-types';
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

const LeftColumn = () => (
  <Grid container>
    <Grid item xs={12}>
      <Field component={TextField} name="name" type="text" label="Name" />
    </Grid>
  </Grid>
);

const RightColumn = ({ values }: { values: Call }) => (
  <Grid container>
    <Grid item xs={12}>
      <EmailsField name="guestEmails" values={values.guestEmails ?? []} />
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

      <Formik initialValues={initialValues} validationSchema={CallSchema} onSubmit={submitCall}>
        {({ values, submitForm, isSubmitting }) => (
          <Form>
            <Grid item xs={9}>
              <LeftColumn />
            </Grid>
            <Grid item xs={3}>
              <RightColumn values={values} />
            </Grid>

            <Grid item xs={12}>
              {isSubmitting && <LinearProgress />}
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
              >
                Submit
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    </Grid>
  );
}
