import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import { LocalModel, CallData } from '~/firebase/schema-types';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      '& h2': {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        fontWeight: 'bold',
      },
    },
  }),
);

export default function DataCard({ data }: { data: { [key: string]: CallData } }) {
  const classes = useStyles();

  const tasksData = data.callData;

  return (
    <Card className={classes.container}>
      <CardContent>
        <Typography variant="h2">Notes</Typography>
      </CardContent>
    </Card>
  );
}
