import React from 'react';
import { Switch } from 'formik-material-ui';
import { Field, FieldArray, ErrorMessage, useFormikContext } from 'formik';
import { TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { PollActivityMetadata } from '~/firebase/schema-types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      color: theme.palette.error.main,
    },
  }),
);

export default function CreatePollActivity() {
  const classes = useStyles();
  const { values } = useFormikContext<PollActivityMetadata>();

  const MyErrorMessage = ({ name }: { name: string }) => (
    <ErrorMessage className={classes.error} name={name} component="span" />
  );

  return (
    <div>
      <FieldArray name="options">
        {({ remove, push }) => (
          <>
            {values.options.map((_, index) => (
              <div key={index}>
                <Field component={TextField} name={`options.${index}`} />
                <MyErrorMessage name={`options.${index}`} />
                <button type="button" onClick={() => remove(index)}>
                  X
                </button>
              </div>
            ))}

            <button type="button" onClick={() => push('')}>
              Add Option
            </button>
          </>
        )}
      </FieldArray>

      <Field component={Switch} type="checkbox" name="showResultsRightAway" />
      <MyErrorMessage name="showResultsRightAway" />

      <Field component={Switch} type="checkbox" name="isMultipleChoice" />
      <MyErrorMessage name="isMultipleChoice" />
    </div>
  );
}
