import React, { useState, useEffect, useRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Hidden, Drawer } from '@material-ui/core';
import { isBrowser } from '~/utils';
import Items from './Items';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'stretch',
    },
    drawerContainer: {
      ...theme.customMixins.activitiesBarMini,
      flexShrink: 0,
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
      alignItems: 'stretch',
    },
    controlsContainer: {
      height: 100,
      flexShrink: 0,
    },
  }),
);

interface PropTypes {
  variant: 'grid' | 'focus';
  hideControls?: boolean; // hide the rest of the UI and focus only on layout
  gridItems: { key: string; node: React.ReactNode }[];
  // only needed when variant is `focus`
  mainItem?: React.ReactNode;
  sideItem: React.ReactNode;
  mainControls: React.ReactNode;
  sideControls: React.ReactNode;
}

export default function VideoLayout({
  variant,
  hideControls,
  gridItems,
  mainItem,
  sideItem,
  mainControls,
  sideControls,
}: PropTypes) {
  const classes = useStyles();
  // xs default to closed, others default to open
  const [isActivityDrawerOpenXs, setIsActivityDrawerOpenXs] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(true);
  const container = isBrowser ? () => window.document.body : undefined;

  const drawer = (
    <>
      <Hidden smUp implementation="js">
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={isActivityDrawerOpenXs}
          onClose={() => setIsActivityDrawerOpenXs(false)}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {sideItem}
        </Drawer>
      </Hidden>

      <Hidden xsDown implementation="js">
        <Drawer
          className={classes.drawerContainer}
          container={container}
          variant={hideControls ? 'temporary' : 'persistent'}
          anchor="left"
          open={isActivityDrawerOpen}
          onClose={() => setIsActivityDrawerOpen(false)}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {sideItem}
        </Drawer>
      </Hidden>
    </>
  );

  // when hideControls flag is set, auto hide drawer
  // when flag is unset, restore old state
  const prevActivityOpenState = useRef<boolean>(isActivityDrawerOpen);
  useEffect(() => {
    if (hideControls) {
      setIsActivityDrawerOpen((state) => {
        prevActivityOpenState.current = state;
        return false;
      });
    } else {
      setIsActivityDrawerOpen(prevActivityOpenState.current);
    }
  }, [hideControls]);

  const controls = (
    <div className={classes.controlsContainer}>
      {mainControls}
      {sideControls}
    </div>
  );

  return (
    <div className={classes.container}>
      {drawer}
      <div className={classes.actionArea}>
        <Items variant={variant} gridItems={gridItems} mainItem={mainItem} />
        {controls}
      </div>
    </div>
  );
}
