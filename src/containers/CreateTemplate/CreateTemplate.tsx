import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { Typography, Button, CircularProgress, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import BackButton from '~/components/BackButton/BackButton';

const FormSchema = Yup.object().shape({
  name: Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required(),
});

const initialValues = {
  name: '',
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      '& >button': {
        position: 'fixed',
        top: theme.spacing(1),
        left: theme.spacing(1),
      },
    },
    paper: {
      ...theme.customMixins.modalPaper,
      padding: theme.spacing(3),
      // assume height maxes out at ~330px (change if needed)
      marginTop: 'calc(50vh - 165px)',
      marginLeft: 'auto',
      marginRight: 'auto',

      '& h1,p': {
        marginBottom: theme.spacing(1),
      },
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
      <Typography variant="h1">Create a new room</Typography>
      <Typography variant="body1">
        A room is a space for collaboration. Plan out your call by configuring different activities,
        share the call to participants with a permanent call link, and start the call with one
        click!
      </Typography>
      <Field
        data-testid="template-name"
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
        data-testid="create-button"
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

interface PropTypes {
  save(values: { name: string }): Promise<void>;
}

export default function CreateContainer({ save }: PropTypes) {
  const classes = useStyles();

  const submit = useCallback(
    (values, { setSubmitting }) => {
      setSubmitting(true);
      // just keep showing submit spinner even after created since we'll nav to new page
      // hide if error
      save(values).catch(() => setSubmitting(false));
    },
    [save],
  );

  return (
    <div className={classes.container}>
      <BackButton />
      <Formik initialValues={initialValues} validationSchema={FormSchema} onSubmit={submit}>
        {({ isSubmitting }) => (
          <Form>
            <TemplateForm isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </div>
  );
}
