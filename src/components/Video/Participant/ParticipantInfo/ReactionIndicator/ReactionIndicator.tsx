import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import useDimensions from 'react-cool-dimensions';
import { ReactionMap, ReactionType, ReactionTypes } from '~/firebase/rtdb-types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import { CallEvents } from '~/components/CallProvider/events';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3,
      fontSize: ({ width }: { width: number }) => width / 2 + 'px',
      color: 'white',
      pointerEvents: 'none',

      '& >span': {
        visibility: 'hidden',
        opacity: 0,
        transform: 'scale(0.5)',
        animation: 'popIn 1.5s',
        cursor: 'default',
      },
    },

    // define animation for pop in text
    '@global': {
      '@keyframes popIn': {
        '0%': {
          visibility: 'visible',
          opacity: 0,
          transform: 'scale(0.5)',
        },
        '20%': {
          opacity: 1,
          transform: 'scale(1)',
        },
        '50%': {
          opacity: 1,
          transform: 'scale(1)',
        },
        '100%': {
          visibility: 'hidden',
          opacity: 0,
          transform: 'scale(2)',
        },
      },
    },
  }),
);

export default function ReactionIndicator({ identity }: { identity: string }) {
  // use width to calculate font size of reaction
  const { ref, width } = useDimensions<HTMLDivElement>({ useBorderBoxSize: true });

  const classes = useStyles({ width });
  const { events } = useCallContext();
  const [showReaction, setShowReaction] = useState<ReactionTypes>();

  // increment everytime a new reaction is received
  // force span to rerender to trigger animation
  const [renderKey, setRenderKey] = useState(0);

  // everytime noti messages change, send to snackbar
  useEffect(() => {
    const handleNewReaction = (reaction: ReactionType) => {
      if (reaction.uid === identity) {
        setShowReaction(reaction.type);
        setRenderKey((state) => state + 1);
      }
    };

    events.on(CallEvents.NEW_REACTION, handleNewReaction);
    return () => {
      events.off(CallEvents.NEW_REACTION, handleNewReaction);
    };
  }, [events, identity]);

  return (
    <div className={classes.container} ref={ref}>
      {showReaction && <span key={renderKey}>{ReactionMap[showReaction]}</span>}
    </div>
  );
}
