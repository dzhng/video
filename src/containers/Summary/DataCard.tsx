import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Divider } from '@material-ui/core';
import type { Activity } from '~/firebase/schema-types';
import type { CallData } from '~/firebase/rtdb-types';
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
  data: CallData;
  activities?: Activity[];
}) {
  const classes = useStyles();

  return (
    <Card className={classes.container}>
      <CardContent>
        <Notes data={data} />
        <Divider />
        <Chats data={data} />

        {activities && (
          <>
            <Divider />
            <Activities data={data} activities={activities} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
