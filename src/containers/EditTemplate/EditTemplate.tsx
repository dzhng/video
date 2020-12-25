import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { Typography, Grid, Button, CircularProgress, Paper, InputBase } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import firebase from '~/utils/firebase';
import { LocalModel, Template } from '~/firebase/schema-types';
import MenuBar from '~/components/MenuBar/MenuBar';
import PresentationPicker from '~/components/PresentationPicker/PresentationPicker';
import NotesEditor from '~/components/NotesEditor/NotesEditor';
import ToolbarContent from './ToolbarContent';

interface PropTypes {
  template?: LocalModel<Template>;
}

const NameSchema = Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required();
const NoteSchema = Yup.string().max(50000);

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const LeftColumn = () => {
  return <Grid container spacing={3}></Grid>;
};

const RightColumn = () => {
  const classes = useStyles();

  return <Grid container></Grid>;
};

const TemplateForm = ({ template }: { template: Template }) => (
  <Grid container spacing={3}>
    <Grid item xs={4}>
      <LeftColumn />
    </Grid>
    <Grid item xs={8}>
      <RightColumn />
    </Grid>
  </Grid>
);

export default function EditContainer({ template }: PropTypes) {
  return (
    <MenuBar toolbarContent={<ToolbarContent template={template} />}>
      {template && <TemplateForm template={template} />}
    </MenuBar>
  );
}
