import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { entries } from 'lodash';
import { useHotkeys } from 'react-hotkeys-hook';
import { Fab, Tooltip, Popper, Card, Fade } from '@material-ui/core';

import { ReactionMap, ReactionTypes } from '~/firebase/rtdb-types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import { useStyles } from '../styles';

export const useComponentStyles = makeStyles((theme) =>
  createStyles({
    fab: {
      fontSize: '1.1rem',
      '& .MuiFab-label': {},
    },
    reactionCard: {
      fontSize: '1.2rem',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      borderRadius: 29,

      '& >div': {
        width: 50,
        height: 36,
        borderRadius: 18,
        overflow: 'hidden',
        textAlign: 'center',
        cursor: 'pointer',
        margin: theme.spacing(0.5),
        padding: theme.spacing(0.5),

        '&:hover': {
          backgroundColor: theme.palette.primary.main + '20',
        },
      },
    },
  }),
);

export default function ReactionButton({
  setPopperMessage,
}: {
  setPopperMessage(node: React.ReactNode, autoClose?: boolean): void;
}) {
  const parentClasses = useStyles();
  const classes = useComponentStyles();
  const anchorRef = useRef<HTMLDivElement>(null);
  // track last reaction created for quick creation via hotkeys
  const [currentReaction, setCurrentReaction] = useState<ReactionTypes>('hello');
  const [pickerOpen, setPickerOpen] = useState(false);
  const { createReaction } = useCallContext();

  const handleCreate = useCallback(
    (type: ReactionTypes) => {
      setPickerOpen(false);
      createReaction(type);
      setCurrentReaction(type);
    },
    [createReaction],
  );

  // setup hotkeys to send default reaction
  useHotkeys(
    'r',
    (e) => {
      e.preventDefault();
      handleCreate(currentReaction);
      setPopperMessage(<>Reaction sent {ReactionMap[currentReaction]}</>, true);
    },
    [handleCreate, currentReaction, setPopperMessage],
  );

  return (
    <>
      <Tooltip title={'Send Reaction [R]'} placement="left" PopperProps={{ disablePortal: true }}>
        {/* Wrapping <Fab/> in <div/> so that tooltip can wrap a disabled element */}
        <div ref={anchorRef}>
          <Fab
            className={clsx(classes.fab, parentClasses.fab)}
            onClick={() => setPickerOpen((state) => !state)}
            onMouseEnter={() => setPickerOpen(true)}
          >
            {ReactionMap[currentReaction]}
          </Fab>
        </div>
      </Tooltip>

      <Popper anchorEl={anchorRef.current} open={pickerOpen} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            {/* set this div with neg margins so there's a lot of room for mouse to move before it's set to disappear */}
            <div
              style={{
                margin: '-40px',
                padding: '40px',
                marginBottom: '-80px',
                paddingBottom: '80px',
              }}
              onClick={() => setPickerOpen(false)}
              onMouseLeave={() => setPickerOpen(false)}
            >
              <Card className={classes.reactionCard}>
                {entries(ReactionMap).map(([key, data]) => (
                  <div key={key} onClick={() => handleCreate(key as ReactionTypes)}>
                    {data}
                  </div>
                ))}
              </Card>
            </div>
          </Fade>
        )}
      </Popper>
    </>
  );
}
