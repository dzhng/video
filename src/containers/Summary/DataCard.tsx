import React from 'react';
import { get } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import { CallData } from '~/firebase/schema-types';
import Notes from './Notes';

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

  return (
    <Card className={classes.container}>
      <CardContent>
        <Typography variant="h2">Notes</Typography>
        <Notes data={data} />
      </CardContent>
    </Card>
  );
}
