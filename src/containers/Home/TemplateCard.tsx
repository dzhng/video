import React from 'react';
import { Typography, Card } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { LocalModel, Template } from '~/firebase/schema-types';

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      cursor: 'pointer',
      padding: theme.spacing(2),
    },
  }),
);

export default function TemplateCard({ template }: { template: LocalModel<Template> }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Typography variant="h5">{template.name}</Typography>
    </Card>
  );
}
