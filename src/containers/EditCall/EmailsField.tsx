import React from 'react';
import { Button } from '@material-ui/core';
import { Field, FieldArray, ErrorMessage } from 'formik';
import { TextField } from 'formik-material-ui';

export default function EmailsField({ name, values }: { name: string; values: string[] }) {
  return (
    <FieldArray name={name}>
      {({ remove, push }) => (
        <>
          {values.map((email, index) => (
            <div key={index}>
              <Field
                component={TextField}
                name={`${name}.${index}`}
                value={email}
                type="text"
                label="Email"
              />
              <ErrorMessage name={`${name}.${index}`} component="div" />
              <Button variant="contained" color="secondary" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button variant="contained" color="primary" onClick={() => push('')}>
            Add Email
          </Button>
        </>
      )}
    </FieldArray>
  );
}
