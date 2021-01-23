import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Divider } from '@material-ui/core';
import { CallData, Activity } from '~/firebase/schema-types';
import Notes from './Notes';
import Chats from './Chats';
import Activities from './Activities';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      '& h2': {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        fontWeight: 'bold',
      },
      '& hr': {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
      },
    },
  }),
);

export default function DataCard({
  data,
  activities,
}: {
  data: { [key: string]: CallData };
  activities?: Activity[];
}) {
  const classes = useStyles();

  return (
    <Card className={classes.container}>
      <CardContent>
        <Typography variant="h2">Notes</Typography>
        <Notes data={data} />

        <Divider />

        <Typography variant="h2">Chats</Typography>
        <Chats data={data} />

        {activities && (
          <>
            <Divider />
            <Typography variant="h2">Activities</Typography>
            <Activities data={data} activities={activities} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
