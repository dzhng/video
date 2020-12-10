import React from 'react';
import { Typography, Grid, Button, Divider } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';

import { LocalModel, Call } from '~/firebase/schema-types';
import CallCard from './CallCard';

interface PropTypes {
  upcomingCalls: LocalModel<Call>[];
  pastCalls: LocalModel<Call>[];
  ongoingCalls: LocalModel<Call>[];
}

const useStyles = makeStyles((theme) =>
  createStyles({
    grid: {
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
      marginTop: theme.spacing(1),
    },
    divider: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    createButton: {},
  }),
);

export default function Home({ upcomingCalls, pastCalls, ongoingCalls }: PropTypes) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h4">Upcoming Calls</Typography>
      <Grid container className={classes.grid} spacing={3}>
        {/* Put ongoing calls in the same section as upcoming, but put it in front of the list so it is noticable */}
        {ongoingCalls.map((call) => (
          <Grid item xs={3} key={call.id}>
            <Link href={`/call/${call.id}/room`}>
              {/* Need to wrap CallCard in div since Link doesn't work with functional components. See: https://github.com/vercel/next.js/issues/7915 */}
              <div>
                <CallCard call={call} />
              </div>
            </Link>
          </Grid>
        ))}

        {upcomingCalls.map((call) => (
          <Grid item xs={3} key={call.id}>
            <Link href={`/call/${call.id}/edit`}>
              <div>
                <CallCard call={call} />
              </div>
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

      {pastCalls.length > 0 && (
        <>
          <Divider className={classes.divider} />
          <Typography variant="h4">Past Calls</Typography>
          <Grid container className={classes.grid} spacing={3}>
            {pastCalls.map((call) => (
              <Grid item xs={3} key={call.id}>
                <Link href={`/call/${call.id}/summary`}>
                  <div>
                    <CallCard call={call} />
                  </div>
                </Link>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  );
}
