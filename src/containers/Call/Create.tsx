import React from 'react';
import * as Yup from 'yup';
import { uniq, compact } from 'lodash';
import { Container, Typography, Button, LinearProgress } from '@material-ui/core';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { TextField } from 'formik-material-ui';

import { Call } from '~/firebase/schema-types';

interface CreateProps {
  createCall(values: Call): void;
}

const CreateSchema = Yup.object().shape({
  name: Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required(),
  externalEmails: Yup.array().of(Yup.string().email('You must provide a valid email')),
});

export default function CreateContainer({ createCall }: CreateProps) {
  return (
    <Container>
      <Typography>Call</Typography>
      <Formik
        initialValues={{
          name: '',
          state: 'pre',
          externalEmails: [],
          createdAt: new Date(),
        }}
        validationSchema={CreateSchema}
        onSubmit={(values: Call, { setSubmitting }) => {
          // clean up any empty emails
          const cleanedEmails = uniq(compact(values.externalEmails));

          createCall({
            ...values,
            externalEmails: cleanedEmails,
          });

          setSubmitting(false);
        }}
      >
        {({ values, submitForm, isSubmitting }) => (
          <Form>
            <Field component={TextField} name="name" type="text" label="Name" />
            <FieldArray name="externalEmails">
              {({ remove, push }) => (
                <div>
                  {values.externalEmails?.map((email, index) => (
                    <div key={index}>
                      <Field
                        component={TextField}
                        name={`externalEmails.${index}`}
                        value={email}
                        type="text"
                        label="Email"
                      />
                      <ErrorMessage name={`externalEmails.${index}`} component="div" />
                      <Button variant="contained" color="secondary" onClick={() => remove(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="contained" color="primary" onClick={() => push('')}>
                    Add Email
                  </Button>
                </div>
              )}
            </FieldArray>
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
