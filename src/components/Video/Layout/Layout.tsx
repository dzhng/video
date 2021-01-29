import React, { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Hidden, Drawer, Tooltip, Fab } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
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
      // make sure to propagate height down for height calculation on safari
      // (which won't work with flex unless it's propagated down)
      height: '100%',

      '&.open': {
        ...theme.customMixins.activitiesBarMini,
        transition: theme.transitions.create(['width', 'min-width', 'max-width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      '&.closed': {
        // need to set all properties set by customMixins for transition to work
        width: 0,
        minWidth: 0,
        maxWidth: 0,
        transition: theme.transitions.create(['width', 'min-width', 'max-width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      flexShrink: 0,
    },
    drawerPaper: {
      ...theme.customMixins.activitiesBarMini,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      // disable background of default MUI paper
      backgroundColor: 'transparent',
      border: 0,
      boxShadow: 'none',
    },
    actionArea: {
      height: '100%',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    controlsContainer: {
      flexShrink: 0,
      padding: theme.spacing(1),
      // no need to pad top since layout on top will already have a lot of padding
      paddingTop: 0,
      display: 'flex',
      justifyContent: 'space-between',
      // controls should always be aligned bottom to ensure equal padding on bottom
      alignItems: 'flex-end',

      [theme.breakpoints.down('xs')]: {
        height: theme.callControlHeightXs,
      },
      [theme.breakpoints.up('sm')]: {
        height: theme.callControlHeight,
      },
    },
    drawerOpenButton: {
      backgroundColor: theme.palette.grey[900],
      color: 'white',

      // if small screen, have smaller buttons so they can all fit
      // align this with Controls/style.ts
      [theme.breakpoints.down('xs')]: {
        width: 40,
        height: 40,
      },
    },
  }),
);

interface PropTypes {
  variant: 'grid' | 'focus';
  hideSideBar?: boolean; // hide the rest of the UI and focus only on layout
  gridItems: { key: string; node: React.ReactNode }[];
  // only needed when variant is `focus`
  mainItem?: React.ReactNode;
  sideItem: React.ReactNode;
  mainControls: React.ReactNode;
  sideControls: React.ReactNode;
}

// TODO: if any fields in drawer is focused (via hotkeys), open drawer
export default function VideoLayout({
  variant,
  hideSideBar,
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

  // set first mount var
  const [firstMount, setFirstMount] = useState(true);
  useEffect(() => {
    setTimeout(() => setFirstMount(false));
  }, []);

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
          className={clsx(classes.drawerContainer, isActivityDrawerOpen ? 'open' : 'closed')}
          variant="persistent"
          anchor="left"
          // start with closed, then we can animate in the drawer after mount
          open={firstMount ? false : isActivityDrawerOpen}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {sideItem}
        </Drawer>
      </Hidden>
    </>
  );

  // when hide flag is set, auto hide drawer
  // when flag is unset, restore old state
  const prevActivityOpenState = useRef<boolean>(isActivityDrawerOpen);
  useEffect(() => {
    if (hideSideBar) {
      setIsActivityDrawerOpen((state) => {
        prevActivityOpenState.current = state;
        return false;
      });
    } else {
      setIsActivityDrawerOpen(prevActivityOpenState.current);
    }
  }, [hideSideBar]);

  const handleDrawerToggle = useCallback(() => {
    setIsActivityDrawerOpen((state) => !state);
    setIsActivityDrawerOpenXs((state) => !state);
  }, []);

  const drawerOpenButton = (
    <Tooltip title="Activities" placement="top" PopperProps={{ disablePortal: true }}>
      <Fab className={classes.drawerOpenButton} onClick={handleDrawerToggle}>
        <MenuIcon />
      </Fab>
    </Tooltip>
  );

  const controls = (
    <motion.div
      className={classes.controlsContainer}
      style={{ y: 70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      {drawerOpenButton}
      {mainControls}
      {sideControls}
    </motion.div>
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
