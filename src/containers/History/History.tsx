import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Divider, Typography, Hidden, IconButton, Grid } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { LocalModel, Call } from '~/firebase/schema-types';
import { formatDuration, formatPastDate } from '~/utils';
import useTemplate from '~/hooks/useTemplate/useTemplate';
import Nav from '~/components/Nav/Nav';

const cardHeight = 110;

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row',
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden', // need it for title ellipsis
      height: 48,

      '& .MuiIconButton-root': {
        // cancel out the padding, but don't set padding at 0 since that changes hover shape
        marginLeft: '-12px',
      },
    },
    grid: {
      maxHeight: '100vh',
      overflowY: 'auto',
      // add  a good amount of padding on bottom so fixed positioned intercom button doesn't
      // overlap too much with items, it also looks better balanced with toolbar
      paddingBottom: 72,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      flexGrow: 1,

      // override spacing-3 negative margins which causes a scroll bar
      width: '100%',
      margin: 0,
    },
    callItem: {
      minHeight: cardHeight,
      padding: theme.spacing(2),
      cursor: 'pointer',

      '&:hover': {
        boxShadow: theme.shadows[4],
      },
      '& h3': {
        wrap: 'ellipsis',
        overflow: 'hidden',
      },
      '& hr': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    cardSkeleton: {
      borderRadius: theme.shape.borderRadius,
      height: cardHeight,
    },
  }),
);

const cardItemSizeProps: { [key: string]: 12 | 6 | 4 | 3 | 2 } = {
  xs: 12,
  sm: 12, // abrupt transition because of drawer hiding
  md: 4,
  lg: 3,
  xl: 2,
};

const CallCard = ({ call }: { call: LocalModel<Call> }) => {
  const classes = useStyles();
  const template = useTemplate(call.templateId);

  return (
    <Card className={classes.callItem}>
      <Typography variant="h3">{template ? template.name : <Skeleton />}</Typography>
      <Divider />

      <Typography variant="body1">
        <b>Duration:</b> {formatDuration(call?.duration ?? 0)} minutes
      </Typography>
      <Typography variant="body1">
        <b>Created:</b> {formatPastDate((call.createdAt as any).toDate())}
      </Typography>
    </Card>
  );
};

// TODO: lots of duplicate logic between this and home
// in implementing Nav, source to seperate component
export default function HistoryContainer({
  calls,
  isLoadingCalls,
}: {
  calls: LocalModel<Call>[];
  isLoadingCalls: boolean;
}) {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);

  const loadingCallsSkeletons = [0, 1, 2].map((key) => (
    <Grid item {...cardItemSizeProps} key={key}>
      <Skeleton variant="rect" className={classes.cardSkeleton} />
    </Grid>
  ));

  return (
    <div className={classes.container}>
      <Nav mobileOpen={mobileOpen} closeModal={() => setMobileOpen(false)} />
      <Grid container className={classes.grid} spacing={3}>
        <Grid item xs={12}>
          <div className={classes.titleSection}>
            <Hidden smUp implementation="css">
              <IconButton onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Typography variant="h1">Past Calls</Typography>
          </div>
        </Grid>

        {isLoadingCalls
          ? loadingCallsSkeletons
          : calls.map((call) => (
              <Grid item {...cardItemSizeProps} key={call.id}>
                <Link href={`/summary/${call.id}`}>
                  {/* Need to wrap Card in div since Link doesn't work with functional components. See: https://github.com/vercel/next.js/issues/7915 */}
                  <div>
                    <CallCard call={call} />
                  </div>
                </Link>
              </Grid>
            ))}
      </Grid>
    </div>
  );
}
