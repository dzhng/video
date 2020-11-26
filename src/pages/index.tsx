import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import firebase, { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import useFirebaseAuth from '~/state/useFirebaseAuth/useFirebaseAuth';

const useStyles = makeStyles(() =>
  createStyles({
    grid: {
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    callCard: {},
  }),
);

export default withPrivateRoute(function IndexPage() {
  const { user } = useFirebaseAuth();
  const classes = useStyles();
  const [upcomingCalls, setUpcomingCalls] = useState<firebase.firestore.DocumentData>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    db.collection('calls')
      .where('participants', 'array-contains', user.uid)
      .onSnapshot(function (querySnapshot) {
        const calls = querySnapshot.docs.map((doc) => doc.data());
        setUpcomingCalls(calls);
      });
  }, [user]);

  return (
    <Container maxWidth={false}>
      <Grid container className={classes.grid} wrap="nowrap" spacing={3}>
        {upcomingCalls.map((call: any) => (
          <Grid item>
            <Card className={classes.callCard}>
              <Typography>Hello World {call}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
});
