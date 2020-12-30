import React from 'react';
import { Switch } from 'formik-material-ui';
import { Field, ErrorMessage } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      color: theme.palette.error.main,
    },
  }),
);

export default function CreatePollActivity() {
  const classes = useStyles();

  const MyErrorMessage = ({ name }: { name: string }) => (
    <ErrorMessage className={classes.error} name={name} component="span" />
  );

  return (
    <div>
      <Field component={Switch} type="checkbox" name="showResultsRightAway" />
      <MyErrorMessage name="showResultsRightAway" />
      <Field component={Switch} type="checkbox" name="isMultipleChoice" />
      <MyErrorMessage name="isMultipleChoice" />
      <MyErrorMessage name="options" />
    </div>
  );
}
