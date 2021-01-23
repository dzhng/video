import React from 'react';
import Link from 'next/link';
import { Drawer, Fab, Hidden } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { BackIcon } from '~/components/Icons';
import { isBrowser } from '~/utils';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import ActivitiesBar from '~/components/Activities/ActivitiesBar/ActivitiesBar';
import Interactions from '~/components/Call/Interactions';

const useStyles = makeStyles((theme) =>
  createStyles({
    backButton: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    drawerPaper: {
      ...theme.customMixins.activitiesBarMini,
      display: 'flex',
      flexDirection: 'column',
    },
    actionArea: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',

      // if only child, go 100% height
      '& >div:first-child:last-child': {
        maxHeight: '100%',
      },
      '& >div:first-child': {
        maxHeight: '50%',
      },
      '& >div:nth-child(2)': {
        flexBasis: '50%',
        flexGrow: 1,
      },
    },
  }),
);

export default function ActivityDrawer({
  isCallStarted,
  fromHref,
}: {
  isCallStarted: boolean;
  fromHref?: string;
}) {
  const classes = useStyles();
  const {
    template,
    isHost,
    currentActivity,
    startActivity,
    isActivityDrawerOpen,
    setIsActivityDrawerOpen,
  } = useCallContext();

  const container = isBrowser ? () => window.document.body : undefined;

  const drawer = (
    <>
      {!!fromHref && !isCallStarted && (
        <Link href={fromHref}>
          <Fab size="small" className={classes.backButton}>
            <BackIcon />
          </Fab>
        </Link>
      )}

      <div className={classes.actionArea}>
        <ActivitiesBar
          template={template}
          mode={isHost ? (isCallStarted ? 'call' : 'edit') : 'call'}
          currentActivity={currentActivity}
          startActivity={startActivity}
        />
        {isCallStarted && <Interactions />}
      </div>
    </>
  );

  return (
    <>
      <Hidden smUp implementation="js">
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={isActivityDrawerOpen}
          onClose={() => setIsActivityDrawerOpen(false)}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>

      <Hidden xsDown implementation="js">
        <div className={classes.drawerPaper}>{drawer}</div>
      </Hidden>
    </>
  );
}
