import React, { useState, useEffect, useRef } from 'react';
import { without } from 'lodash';
import useDimensions from 'react-cool-dimensions';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ReactionMap, ReactionType } from '~/firebase/rtdb-types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import { CallEvents } from '~/components/CallProvider/events';

const reactionTimeMs = 1500;
const elementsPerReaction = 20;

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
      fontSize: '20px',
      color: 'white',
      pointerEvents: 'none',

      '& >span': {
        position: 'absolute',
        visibility: 'hidden',
        animation: `popIn ${reactionTimeMs / 1000}s`,
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

export default function ReactionIndicator() {
  // measure width and height to figure out how far elements needs to float up
  const { ref, width, height } = useDimensions<HTMLDivElement>();
  const classes = useStyles({ width, height });
  const { events } = useCallContext();
  const [reactionElements, setReactionElements] = useState<React.ReactNode[]>([]);

  // track unmount state so timer don't call setState when unmounted
  const didUnmount = useRef(false);
  useEffect(
    () => () => {
      didUnmount.current = true;
    },
    [],
  );

  // everytime noti messages change, send to snackbar
  useEffect(() => {
    const handleNewReaction = (reaction: ReactionType) => {
      const elements = Array(elementsPerReaction).map((_, idx) => (
        <span key={idx} style={{ bottom: 0, left: Math.random() * width }}>
          {ReactionMap[reaction.type]}
        </span>
      ));

      setReactionElements((state) => [...elements, ...state]);

      // after animation is over, remove all elements
      setTimeout(() => {
        if (!didUnmount.current) {
          setReactionElements((state) => without(state, ...elements));
        }
      }, reactionTimeMs);
    };

    events.on(CallEvents.NEW_REACTION, handleNewReaction);
    return () => {
      events.off(CallEvents.NEW_REACTION, handleNewReaction);
    };
  }, [events, width]);

  return (
    <div ref={ref} className={classes.container}>
      {reactionElements}
    </div>
  );
}
