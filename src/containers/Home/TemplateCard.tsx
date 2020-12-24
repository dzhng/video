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

export default function TemplateCard({
  template,
  height,
}: {
  template: LocalModel<Template>;
  height: number;
}) {
  const classes = useStyles();

  return (
    <Card className={classes.card} style={{ height }}>
      <Typography variant="h3">{template.name}</Typography>
    </Card>
  );
}
