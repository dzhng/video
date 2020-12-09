import React from 'react';
import { Typography, Grid, Card, Button } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';

import { formatDate } from '~/utils';
import firebase from '~/utils/firebase';
import { LocalModel, Call } from '~/firebase/schema-types';

const useStyles = makeStyles((theme) =>
  createStyles({
    grid: {
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    callCard: {
      cursor: 'pointer',
      padding: theme.spacing(2),
    },
    createButton: {},
  }),
);

export default function Home({ calls }: { calls: LocalModel<Call>[] }) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h4">Calls</Typography>
      <Grid container className={classes.grid} spacing={3}>
        {calls.map((call) => (
          <Grid item xs={3} key={call.id}>
            <Link href={`/call/${call.id}/edit`}>
              <Card className={classes.callCard}>
                <Typography variant="h5">{call.name}</Typography>
                <Typography variant="body1">
                  {call.guestEmails?.length} invited attendees
                </Typography>
                <Typography variant="body2">
                  Created: {formatDate((call.createdAt as firebase.firestore.Timestamp).toDate())}
                </Typography>
              </Card>
            </Link>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Link href="/call/create">
            <Button
              color="primary"
              variant="contained"
              size="large"
              className={classes.createButton}
            >
              Create Call
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  );
}
