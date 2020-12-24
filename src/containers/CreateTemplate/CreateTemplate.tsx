import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { Typography, Button, CircularProgress, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

interface PropTypes {
  save(values: { name: string }): Promise<void>;
}

const FormSchema = Yup.object().shape({
  name: Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required(),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(3),
      maxWidth: theme.modalWidth,
      marginTop: theme.spacing(6),
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    submitButton: {
      marginTop: theme.spacing(3),
      height: 42,
    },
  }),
);

const TemplateForm = ({ isSubmitting }: { isSubmitting: boolean }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Typography variant="h1">Create Call Template</Typography>
      <Field
        component={TextField}
        name="name"
        type="text"
        label="Name"
        placeholder="What is this template about?"
        fullWidth
        margin="normal"
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button
        fullWidth
        className={classes.submitButton}
        size="large"
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={'1.5rem'} /> : 'Create'}
      </Button>
    </Paper>
  );
};

export default function EditContainer({ save }: PropTypes) {
  // A lot of these values are not editable in the UI, but we initialize them anyways with existing or default values so that we get nice typescript checking via the Presentation model. Maybe there's a better way to do this in the future that's cleaner and still get same type checking.
  const initialValues = {
    name: '',
  };

  const submit = useCallback(
    async (values, { setSubmitting }) => {
      setSubmitting(true);
      await save(values);
      setSubmitting(false);
    },
    [save],
  );

  return (
    <Formik initialValues={initialValues} validationSchema={FormSchema} onSubmit={submit}>
      {({ isSubmitting }) => (
        <Form>
          <TemplateForm isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
}
