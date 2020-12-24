import React from 'react';
import { Typography, Card } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      cursor: 'pointer',
      padding: theme.spacing(2),
    },
  }),
);

export default function CreateCard({ height }: { height: number }) {
  const classes = useStyles();

  return (
    <Card className={classes.card} style={{ height }}>
      <Typography variant="h3">Create Template</Typography>
    </Card>
  );
}
