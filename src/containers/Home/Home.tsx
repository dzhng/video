import React from 'react';
import { Typography, Grid, Card, Button } from '@material-ui/core';
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
    <Grid container className={classes.grid} wrap="nowrap" spacing={3}>
      {calls.map((call: any) => (
        <Grid item>
          <Card className={classes.callCard}>
            <Typography>Hello World {JSON.stringify(call)}</Typography>
          </Card>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Link href="/call/create">
          <Button color="primary" variant="contained" size="large" className={classes.createButton}>
            Create Call
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
}
