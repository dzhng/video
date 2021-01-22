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

// copied from MUI documentation
type PopperPlacement =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top';

export default function useHotkeyPopper(options?: {
  className?: string;
  placement?: PopperPlacement;
  timeout?: number;
}) {
  const classes = useStyles();
  const anchorRef = useRef<HTMLDivElement>(null);
  const popperTimer = useRef<any>();
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [popperMessage, _setPopperMessage] = useState<React.ReactNode>(null);

  // auto close var will automatically open and close popper after set time
  const setPopperMessage = useCallback(
    (node: React.ReactNode, autoClose?: boolean) => {
      _setPopperMessage(node);
      if (autoClose) {
        setIsPopperOpen(true);

        if (popperTimer.current) {
          clearTimeout(popperTimer.current);
          popperTimer.current = undefined;
        }
        popperTimer.current = setTimeout(() => setIsPopperOpen(false), options?.timeout ?? 1500);
      }
    },
    [options],
  );

  const popperElement = useMemo(
    () => (
      <Popper
        open={isPopperOpen}
        anchorEl={anchorRef.current}
        placement={options?.placement ?? 'top'}
        className={options?.className}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card className={classes.popper}>
              <Typography variant="body1">{popperMessage}</Typography>
            </Card>
          </Fade>
        )}
      </Popper>
    ),
    [isPopperOpen, popperMessage, classes, options],
  );

  return { popperElement, anchorRef, isPopperOpen, setIsPopperOpen, setPopperMessage };
}
