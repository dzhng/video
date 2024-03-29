import React from 'react';
import { Backdrop, Popper, Fade, Card, Typography, Divider } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    popper: {
      backgroundColor: theme.palette.grey[100],
      boxShadow: theme.shadows[7],
      display: 'flex',

      '& >div': {
        minWidth: 300,
        padding: theme.spacing(1),

        '&:first-child': {
          borderRight: theme.dividerBorder,
        },
      },
      '& h5': {
        marginBottom: theme.spacing(1),
        fontWeight: 'bold',
        color: theme.palette.primary.dark,
      },
    },
    backdrop: {
      zIndex: 200,
    },
    hotkeyItem: {
      margin: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',

      '& span:first-child': {
        flexGrow: 1,
        fontWeight: 'bold',
        marginRight: theme.spacing(1),
      },
      '& span:nth-child(2)': {
        padding: 5,
        flexShrink: 0,
        minWidth: 20,
        textAlign: 'center',
        backgroundColor: theme.palette.primary.main + '20',
        borderRadius: theme.shape.borderRadius,
        fontWeight: 'bolder',
        fontSize: '12px',
        lineHeight: '12px',
      },
    },
    '@global': {
      '.hotkeyInstructionsPopper': {
        minWidth: 300,
        top: 'calc(50vh - 200px) !important',
        zIndex: 201,
      },
    },
  }),
);

const HotkeyItem = ({ title, hotkey }: { title: string; hotkey: string }) => {
  const classes = useStyles();
  return (
    <div className={classes.hotkeyItem}>
      <span>{title}</span>
      <span>{hotkey}</span>
    </div>
  );
};

export default function HotkeyInstructions({
  open,
  anchorRef,
  onClick,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onClick?(): void;
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
        onClick={onClick}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card className={classes.popper}>
              <div>
                <Typography variant="h5">Call Control</Typography>
                <Divider />
                <HotkeyItem title="Push-to-Talk" hotkey="[space]" />
                <HotkeyItem title="Toggle Audio" hotkey="M" />
                <HotkeyItem title="Toggle Video" hotkey="V" />
                <HotkeyItem title="End Call" hotkey="E" />

                <Typography variant="h5">Activities</Typography>
                <Divider />
                <HotkeyItem title="Notes" hotkey="N" />
                <HotkeyItem title="Chats" hotkey="C" />
                <HotkeyItem title="Create Action Item" hotkey="A" />
                <HotkeyItem title="Create Question" hotkey="Q" />
                <HotkeyItem title="Create Take Away" hotkey="T" />
                <HotkeyItem title="Cancel Create" hotkey="[tab]" />
              </div>

              <Divider />

              <div>
                <Typography variant="h5">Presentation</Typography>
                <Divider />
                <HotkeyItem title="Next Slide" hotkey="[right]" />
                <HotkeyItem title="Previous Slide" hotkey="[left]" />

                <Typography variant="h5">Misc</Typography>
                <Divider />
                <HotkeyItem title="Send reaction 👍" hotkey="R" />
                <HotkeyItem title="Full Screen" hotkey="F" />
                <HotkeyItem title="Copy Share Link" hotkey="L" />
                <HotkeyItem title="Join or Create Call (before call start)" hotkey="[enter]" />
                <HotkeyItem title="Hotkey Instructions (this modal)" hotkey="long press [tab]" />
              </div>
            </Card>
          </Fade>
        )}
      </Popper>
    </>
  );
}
