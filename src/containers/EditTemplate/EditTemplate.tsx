import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { Typography, Grid, Button, CircularProgress, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import firebase from '~/utils/firebase';
import { Template } from '~/firebase/schema-types';
import PresentationPicker from '~/components/PresentationPicker/PresentationPicker';
import NotesEditor from '~/components/NotesEditor/NotesEditor';

interface PropTypes {
  template?: Template;
  save(template: Template): void;
}

const NameSchema = Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required();
const NoteSchema = Yup.string().max(50000);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(3),
    },
    submitButton: {
      marginTop: theme.spacing(3),
    },
  }),
);

const InfoFields = ({ isCreate }: { isCreate: boolean }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6">{isCreate ? 'Template Info' : 'Edit Template Info'}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </Paper>
  );
};

const LeftColumn = ({ isCreate }: { isCreate: boolean }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <InfoFields isCreate={isCreate} />
      </Grid>

      <Grid item xs={6}>
        <PresentationPicker name="presentationId" />
      </Grid>

      <Grid item xs={6}>
        <NotesEditor name="note" />
      </Grid>
    </Grid>
  );
};

const RightColumn = ({ isSubmitting, isCreate }: { isSubmitting: boolean; isCreate: boolean }) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Button
          fullWidth
          className={classes.submitButton}
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress /> : isCreate ? 'Create' : 'Save'}
        </Button>
      </Grid>
    </Grid>
  );
};

const TemplateForm = ({ isSubmitting, isCreate }: { isSubmitting: boolean; isCreate: boolean }) => (
  <Grid container spacing={3}>
    <Grid item xs={9}>
      <LeftColumn isCreate={isCreate} />
    </Grid>
    <Grid item xs={3}>
      <RightColumn isSubmitting={isSubmitting} isCreate={isCreate} />
    </Grid>
  </Grid>
);

export default function EditContainer({ template, save }: PropTypes) {
  const isCreate = Boolean(!template);

  // A lot of these values are not editable in the UI, but we initialize them anyways with existing or default values so that we get nice typescript checking via the Presentation model. Maybe there's a better way to do this in the future that's cleaner and still get same type checking.
  const initialValues = {
    name: template?.name ?? '',
    creatorId: template?.creatorId ?? '', // here purely to satisfy Call type
    activities: template?.activities ?? [],
    notes: template?.notes ?? '',
    createdAt: template?.createdAt ?? firebase.firestore.FieldValue.serverTimestamp(),
  };

  const submit = useCallback(
    (values: Template, { setSubmitting }) => {
      save(values);
      setSubmitting(false);
    },
    [save],
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <Formik initialValues={initialValues} validationSchema={FormSchema} onSubmit={submit}>
          {({ isSubmitting }) => (
            <Form>
              <TemplateForm isCreate={isCreate} isSubmitting={isSubmitting} />
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}
