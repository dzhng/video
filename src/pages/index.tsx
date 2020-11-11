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
    callCard: {},
    customerGrid: {},
    customerCard: {},
  }),
);

export default withPrivateRoute(function IndexPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const classes = useStyles();

  return (
    <Container maxWidth={false}>
      <Grid container className={classes.grid} wrap="nowrap" spacing={3}>
        {props.upcomingCalls.map((call: any) => (
          <Grid item>
            <Card className={classes.callCard}>
              <Typography>Hello World {call}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container className={classes.grid} spacing={3}>
        {props.customers.map((customer: any) => (
          <Grid item>
            <Card className={classes.customerCard}>
              <Typography>{customer}</Typography>
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
      upcomingCalls: [],
      customers: [],
    },
  };
}
