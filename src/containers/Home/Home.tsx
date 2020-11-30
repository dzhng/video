import React from 'react';
import { Container, Typography, Grid, Card, Fab } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';

import { Call } from '~/firebase/schema-types';

const useStyles = makeStyles(() =>
  createStyles({
    grid: {
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    callCard: {},
    createButton: {},
  }),
);

export default function Home({ calls }: { calls: Call[] }) {
  const classes = useStyles();

  return (
    <Container maxWidth={false}>
      <Grid container className={classes.grid} wrap="nowrap" spacing={3}>
        {calls.map((call: any) => (
          <Grid item>
            <Card className={classes.callCard}>
              <Typography>Hello World {call}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Link href="/call/create">
        <Fab className={classes.createButton}>Create Call</Fab>
      </Link>
    </Container>
  );
}
