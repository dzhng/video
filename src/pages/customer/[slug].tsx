import React from 'react';
import { InferGetServerSidePropsType } from 'next';
import { Container, Typography, Grid, Card } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';

const useStyles = makeStyles(() =>
  createStyles({
    grid: {
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    card: {},
  }),
);

export default withPrivateRoute(function RoomPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const classes = useStyles();

  return (
    <Container maxWidth={false}>
      <Grid container className={classes.grid} spacing={3}>
        {props.scheduledCalls.map((call: any) => (
          <Grid item>
            <Card className={classes.card}>
              <Typography>Hello world {call}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
});

export async function getServerSideProps() {
  return {
    props: {
      scheduledCalls: [],
    },
  };
}
