import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Grid, Typography, IconButton } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { BackIcon } from '~/components/Icons';
import { LocalModel, Call, CallData } from '~/firebase/schema-types';
import type { ParticipantRecord } from './types';
import CallCard from './CallCard';
import DataCard from './DataCard';

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(3),
      display: 'flex',
      alignItems: 'center',
    },
  }),
);

export default function SummaryContainer({
  call,
  data,
  participants,
  fromHref,
}: {
  call: LocalModel<Call>;
  data: { [key: string]: CallData };
  participants: ParticipantRecord[];
  fromHref?: string;
}) {
  const classes = useStyles();

  // generate back button href and prefetch for good perf
  const backHref = fromHref ?? '/';
  const router = useRouter();
  router.prefetch(backHref);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1" className={classes.title}>
            <Link href={backHref}>
              <IconButton>
                <BackIcon />
              </IconButton>
            </Link>

            <b>Call Summary</b>
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <CallCard call={call} participants={participants} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DataCard data={data} />
        </Grid>
      </Grid>
    </Container>
  );
}
