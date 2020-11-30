import React from 'react';
import { Container, Typography, Button, LinearProgress } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import { Call } from '~/firebase/schema-types';

interface CreateProps {
  createCall(values: Call): void;
}

const CreateSchema = Yup.object().shape({
  name: Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required('Required'),
});

export default function CreateContainer({ createCall }: CreateProps) {
  return (
    <Container>
      <Typography>Call</Typography>
      <Formik
        initialValues={{
          name: '',
          state: 'pre',
          createdAt: new Date(),
        }}
        validationSchema={CreateSchema}
        onSubmit={(values: Call, { setSubmitting }) => {
          createCall(values);
          setSubmitting(false);
        }}
      >
        {({ submitForm, isSubmitting }) => (
          <Form>
            <Field component={TextField} name="name" type="text" label="Name" />
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
