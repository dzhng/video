import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Popper, Fade, Card, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    popper: {
      padding: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
      color: 'white',
      boxShadow: theme.shadows[7],
    },
  }),
);

export default function useHotkeyPopper() {
  const classes = useStyles();
  const anchorRef = useRef<HTMLDivElement>(null);
  const popperTimer = useRef<any>();
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [popperMessage, _setPopperMessage] = useState<React.ReactNode>(null);

  // auto close var will automatically open and close popper after set time
  const setPopperMessage = useCallback((node: React.ReactNode, autoClose?: boolean) => {
    _setPopperMessage(node);
    if (autoClose) {
      setIsPopperOpen(true);

      if (popperTimer.current) {
        clearTimeout(popperTimer.current);
        popperTimer.current = undefined;
      }
      popperTimer.current = setTimeout(() => setIsPopperOpen(false), 1500);
    }
  }, []);

  const popperElement = useMemo(
    () => (
      <Popper open={isPopperOpen} anchorEl={anchorRef.current} placement="top" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card className={classes.popper}>
              <Typography variant="body1">{popperMessage}</Typography>
            </Card>
          </Fade>
        )}
      </Popper>
    ),
    [isPopperOpen, popperMessage, classes],
  );

  return { popperElement, anchorRef, isPopperOpen, setIsPopperOpen, setPopperMessage };
}
