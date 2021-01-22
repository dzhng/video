import React from 'react';
import { Backdrop, Popper, Fade, Card, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    popper: {
      padding: theme.spacing(1),
      backgroundColor: theme.palette.grey[100],
      boxShadow: theme.shadows[7],
    },
    backdrop: {
      zIndex: 0,
    },
    '@global': {
      '.hotkeyInstructionsPopper': {
        minWidth: 400,
        top: 'calc(50vh - 200px) !important',
      },
    },
  }),
);

export default function HotkeyInstructions({
  open,
  anchorRef,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement>;
}) {
  const classes = useStyles();

  return (
    <>
      <Backdrop className={classes.backdrop} open={open} />
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom"
        className="hotkeyInstructionsPopper"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card className={classes.popper}>
              <Typography variant="h2">Call Hotkeys</Typography>
            </Card>
          </Fade>
        )}
      </Popper>
    </>
  );
}
