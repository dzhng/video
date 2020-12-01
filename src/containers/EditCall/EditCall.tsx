import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { uniq, compact } from 'lodash';
import { Container, Typography, Button, LinearProgress } from '@material-ui/core';
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

export default function EditContainer({ call, saveCall }: PropTypes) {
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
    <Container>
      {call && <InfoBar call={call} />}
      <Typography>Call</Typography>
      <Formik initialValues={initialValues} validationSchema={CallSchema} onSubmit={submitCall}>
        {({ values, submitForm, isSubmitting }) => (
          <Form>
            <Field component={TextField} name="name" type="text" label="Name" />
            <EmailsField name="guestEmails" values={values.guestEmails ?? []} />
            {isSubmitting && <LinearProgress />}
            <br />
            <Button
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              onClick={submitForm}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
